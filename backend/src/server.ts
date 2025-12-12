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

// Initialize DB
initializeDatabase()
    .then(async () => {
        console.log('Database initialized');
        // Start simulator after DB is ready
        await simulator.initialize();
        simulator.start();
    })
    .catch(console.error);
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

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export { io };
