import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db/connection';
import { initializeDatabase } from './db/init';
import vehicleRoutes from './routes/vehicles';
import alertRoutes from './routes/alerts';

dotenv.config();

const app = express();
const httpServer = createServer(app);

import { simulator } from './services/simulatorService';

const io = new Server(httpServer, {
    cors: { origin: '*' } // Allow all for demo
});

app.use(cors());
app.use(express.json());
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/alerts', alertRoutes);

app.get('/', (req, res) => {
    res.send('VehicleIQ Backend Running');
});

app.get('/api', (req, res) => {
    res.json({
        message: 'VehicleIQ API',
        endpoints: [
            'GET /api/vehicles',
            'GET /api/vehicles/:id',
            'GET /api/vehicles/:id/history',
            'GET /api/alerts',
            'POST /api/alerts/:id/acknowledge',
            'GET /health'
        ]
    });
});

app.get('/health', async (req, res) => {
    try {
        // Check if database is accessible
        const result = await pool.query('SELECT COUNT(*) as count FROM vehicles');
        res.json({
            status: 'healthy',
            database: 'connected',
            vehicleCount: result.rows[0]?.count || 0,
            timestamp: new Date().toISOString()
        });
    } catch (error: any) {
        console.error('Health check failed:', error);
        res.status(503).json({
            status: 'unhealthy',
            database: 'error',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

const PORT = process.env.PORT || 3001;

// Start server only after database is initialized
async function startServer() {
    try {
        console.log('🚀 Starting VehicleIQ Backend...');
        console.log('📊 Initializing database...');
        await initializeDatabase();
        console.log('✅ Database initialized successfully');

        // Start server immediately after DB is ready
        httpServer.listen(PORT, () => {
            console.log(`✅ Server running on port ${PORT}`);
        });

        // Initialize simulator in background (don't block server startup)
        console.log('🤖 Initializing simulator...');
        simulator.initialize()
            .then(() => {
                simulator.start();
                console.log('✅ Simulator started');
            })
            .catch(err => {
                console.error('⚠️  Simulator failed to start:', err.message);
                console.log('Server will continue running without simulator');
            });

    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

startServer();

export { io };
