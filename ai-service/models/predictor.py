import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
import pickle
import os
from datetime import datetime, timedelta

class PredictiveMaintenance:
    def __init__(self):
        self.model_path = 'model.pkl'
        self.model = None
        self.load_or_train()

    def load_or_train(self):
        if os.path.exists(self.model_path):
            try:
                with open(self.model_path, 'rb') as f:
                    self.model = pickle.load(f)
                print("Loaded existing model")
            except Exception as e:
                print(f"Error loading model: {e}")
                self.train_simple_model()
        else:
            self.train_simple_model()

    def train_simple_model(self):
        print("Training new simple model...")
        # Synthetic data generation
        # Features: [avg_temp, avg_battery, fuel_var, odometer]
        X = []
        y = []

        for _ in range(1000):
            temp = np.random.uniform(80, 110)
            battery = np.random.uniform(11, 14.5)
            fuel_var = np.random.uniform(0, 5)
            odometer = np.random.randint(1000, 100000)

            # Rule: High temp (>100) OR Low battery (<12) OR High Mileage (>80000) => Maintenance
            needs_maint = 0
            if temp > 100 or battery < 12 or odometer > 80000:
                needs_maint = 1
            
            X.append([temp, battery, fuel_var, odometer])
            y.append(needs_maint)

        self.model = RandomForestClassifier(n_estimators=50, random_state=42)
        self.model.fit(X, y)
        
        with open(self.model_path, 'wb') as f:
            pickle.dump(self.model, f)
        print("Model trained and saved")

    def predict(self, telemetry_data):
        if not self.model:
            return None

        # telemetry_data is expected to be list of dicts or objects
        # For simplicity, we calculate aggregates from the last 100 points
        if not telemetry_data:
            return None

        df = pd.DataFrame(telemetry_data)
        
        # Calculate features
        avg_temp = df['engine_temp'].mean()
        avg_battery = df['battery_voltage'].mean()
        fuel_var = df['fuel_level'].var() if len(df) > 1 else 0
        odometer = df['odometer'].max()

        features = [[avg_temp, avg_battery, fuel_var, odometer]]
        
        try:
            prediction = self.model.predict(features)[0]
            probability = self.model.predict_proba(features)[0][1]
            return {
                "needs_maintenance": bool(prediction),
                "confidence": float(probability),
                "days_until_maintenance": int((1 - probability) * 30) if not prediction else 0
            }
        except Exception as e:
            print(f"Prediction error: {e}")
            return None
