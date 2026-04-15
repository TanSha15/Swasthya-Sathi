import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import connectDB from './config/db.js';
import http from 'http';
import https from 'https';
import { Server } from 'socket.io';
import initializeVideoSocket from './socket/videoHandler.js';

import authRoutes from './routes/authRoutes.js';
import doctorRoutes from './routes/doctorRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';

dotenv.config();
await connectDB();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

initializeVideoSocket(io);

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));


app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/appointments', appointmentRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Swasthya Sathi API' });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    
    // Auto-ping to prevent Render sleep mode (14 min intervals)
    if (process.env.RENDER_EXTERNAL_URL) {
      setInterval(() => {
        https.get(`${process.env.RENDER_EXTERNAL_URL}/api/health`, (res) => {
           console.log(`Keep-alive ping sent. Status: ${res.statusCode}`);
        }).on('error', (e) => {
           console.error(`Keep-alive ping failed: ${e.message}`);
        });
      }, 14 * 60 * 1000);
    }
});