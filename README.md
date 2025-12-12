# VehicleIQ AI - Smart Fleet Management Dashboard

A production-quality real-time fleet management dashboard with AI-powered predictive maintenance and natural language chat.

![Dashboard Preview](https://via.placeholder.com/800x400?text=VehicleIQ+Dashboard+Preview)

## Features

- **Real-Time Tracking**: Live map showing vehicle locations using Leaflet and WebSocket.
- **Live Telemetry**: Real-time updates for speed, fuel, temperature, and battery.
- **AI Predictive Maintenance**: Machine learning model (Random Forest) to predict service needs.
- **Natural Language Chat**: Ask questions like "Which vehicles need service?" using OpenAI.
- **Alert System**: Immediate notifications for critical issues (low fuel, high temp).
- **Historical Analysis**: Interactive charts for fleet performance.

## Tech Stack

- **Frontend**: React 18, TypeScript, Redux Toolkit, Material-UI, Recharts, Leaflet
- **Backend**: Node.js, Express, Socket.io, TypeScript, PostgreSQL, Redis
- **AI Service**: Python, Flask, scikit-learn, OpenAI API
- **Infrastructure**: Docker Compose, Railway (ready)

## Architecture

The system consists of three main microservices:
1. **Frontend**: SPA served via Vite.
2. **Backend**: Node.js API and WebSocket server. Manages DB and simulates vehicles.
3. **AI Service**: Python service for ML predictions and NLP.

## Prerequisites

- Docker & Docker Compose
- Node.js v18+ (for local dev without Docker)
- Python 3.10+ (for local AI dev)
- OpenAI API Key

## Installation & Setup (Local Demo Mode)

This project is configured to run locally using SQLite and an in-memory Redis mock, so you **do not need Docker** or complex system installations.

1. **Setup Dependencies**
   Run the automatic setup script from the root directory:
   ```bash
   npm run setup
   ```

2. **Run the Services**
   Open 3 separate terminal tabs/windows and run these commands:

   **Terminal 1 (Backend - Port 3001)**
   ```bash
   npm run start:backend
   ```

   **Terminal 2 (AI Service - Port 5001)**
   ```bash
   npm run start:ai
   ```

   **Terminal 3 (Frontend - Port 5173)**
   ```bash
   npm run start:frontend
   ```

3. **Access the Dashboard**
   - Open [http://localhost:5173](http://localhost:5173) in your browser.

7. **API Documentation** - List all endpoints with examples

### Vehicles
- `GET /api/vehicles` - List all vehicles
- `GET /api/vehicles/:id` - Get vehicle details
- `GET /api/vehicles/:id/history` - Get telemetry history

### Alerts
- `GET /api/alerts` - Get active alerts
- `POST /api/alerts/:id/acknowledge` - Acknowledge an alert

### AI
- `POST /api/ai/chat` - Chat with fleet assistant
- `GET /api/ai/predict-maintenance/:id` - Get maintenance prediction

## License

MIT
