-- Vehicles master table
CREATE TABLE IF NOT EXISTS vehicles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vehicle_id TEXT UNIQUE NOT NULL,
    make TEXT,
    model TEXT,
    status TEXT DEFAULT 'active',
    last_maintenance_date TEXT,
    odometer INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Real-time telemetry data
CREATE TABLE IF NOT EXISTS telemetry (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vehicle_id TEXT,
    timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
    latitude REAL,
    longitude REAL,
    speed REAL,
    fuel_level REAL,
    engine_temp REAL,
    battery_voltage REAL,
    odometer INTEGER,
    FOREIGN KEY(vehicle_id) REFERENCES vehicles(vehicle_id)
);

CREATE INDEX IF NOT EXISTS idx_telemetry_vehicle_time ON telemetry(vehicle_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_telemetry_timestamp ON telemetry(timestamp DESC);

-- Alerts table
CREATE TABLE IF NOT EXISTS alerts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vehicle_id TEXT,
    alert_type TEXT,
    message TEXT,
    severity INTEGER,
    acknowledged BOOLEAN DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(vehicle_id) REFERENCES vehicles(vehicle_id)
);

-- AI predictions table
CREATE TABLE IF NOT EXISTS predictions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vehicle_id TEXT,
    prediction_type TEXT,
    confidence REAL,
    predicted_date TEXT,
    details TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(vehicle_id) REFERENCES vehicles(vehicle_id)
);

-- Seed 10 vehicles
INSERT OR IGNORE INTO vehicles (vehicle_id, make, model, odometer) VALUES
('VEH-001', 'Toyota', 'Camry', 45000),
('VEH-002', 'Honda', 'Accord', 32000),
('VEH-003', 'Ford', 'F-150', 67000),
('VEH-004', 'Tesla', 'Model 3', 28000),
('VEH-005', 'Chevrolet', 'Silverado', 51000),
('VEH-006', 'Toyota', 'RAV4', 39000),
('VEH-007', 'Honda', 'CR-V', 42000),
('VEH-008', 'Ford', 'Explorer', 55000),
('VEH-009', 'Tesla', 'Model Y', 31000),
('VEH-010', 'Chevrolet', 'Tahoe', 48000);
