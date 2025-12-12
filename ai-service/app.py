from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import sqlite3
import pandas as pd
from datetime import datetime
from services.openai_service import OpenAIService
from models.predictor import PredictiveMaintenance
from dotenv import load_dotenv

# Load environment variables from root .env file
root_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(root_path, '.env'), override=True)

app = Flask(__name__)
CORS(app)

# Initialize Services
openai_service = OpenAIService()
predictor = PredictiveMaintenance()

def get_db_connection():
    # Connect to the same SQLite file as the backend
    # Path: ../backend/vehicleiq.sqlite
    db_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'backend', 'vehicleiq.sqlite')
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row # Allow accessing columns by name
    return conn

@app.route('/', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "service": "ai-service", "mode": "local-sqlite"})

@app.route('/api/ai/chat', methods=['POST'])
def chat():
    data = request.json
    question = data.get('question')
    
    if not question:
        return jsonify({"error": "No question provided"}), 400

    # Fetch context from DB
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        # Get fleet summary
        cur.execute("SELECT COUNT(*) FROM vehicles")
        total_vehicles = cur.fetchone()[0]
        
        cur.execute("SELECT COUNT(*) FROM vehicles WHERE status = 'active'")
        active_vehicles = cur.fetchone()[0]
        
        # SQLite doesn't support array_agg or JSON directly easily, so we fetch and format locally
        cur.execute("SELECT vehicle_id, alert_type FROM alerts WHERE acknowledged = 0 LIMIT 5")
        recent_alerts = [dict(row) for row in cur.fetchall()]
        
        cur.close()
        conn.close()
        
        context = f"""
        Total Vehicles: {total_vehicles}
        Active Vehicles: {active_vehicles}
        Recent Alerts: {recent_alerts}
        """
        
        answer = openai_service.ask_fleet_question(question, context)
        return jsonify({"question": question, "answer": answer})
        
    except Exception as e:
        print(f"Error in chat endpoint: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/ai/predict-maintenance/<vehicle_id>', methods=['GET'])
def predict_maintenance(vehicle_id):
    try:
        conn = get_db_connection()
        # Fetch last 100 telemetry records
        # Use ? parameter syntax for SQLite
        query = """
            SELECT engine_temp, battery_voltage, fuel_level, odometer 
            FROM telemetry 
            WHERE vehicle_id = ? 
            ORDER BY timestamp DESC 
            LIMIT 100
        """
        df = pd.read_sql_query(query, conn, params=(vehicle_id,))
        conn.close()
        
        if df.empty:
            return jsonify({"error": "No telemetry data found"}), 404
            
        # Convert to list of dicts for predictor
        telemetry_data = df.to_dict('records')
        
        result = predictor.predict(telemetry_data)
        
        if result:
            result['vehicle_id'] = vehicle_id
            return jsonify(result)
        else:
            return jsonify({"error": "Prediction failed"}), 500
            
    except Exception as e:
        print(f"Error in prediction endpoint: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # MacOS AirPlay often uses port 5000, so we use 5001
    # We use AI_PORT to avoid conflict with the backend's PORT (3001) in the shared .env
    port = int(os.environ.get('PORT') or os.environ.get('AI_PORT', 5001))
    app.run(host='0.0.0.0', port=port)
