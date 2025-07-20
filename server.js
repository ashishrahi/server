import express from 'express';
import dotenv from 'dotenv';
import cron from 'node-cron';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import importLogRoutes from './src/routes/importLogRoutes.js';
import { fetchJobsFromFeeds } from './src/services/JobService.js';
import dbConnect from './src/config/dbConnect.js';
import './src/workers/worker.js';
dotenv.config();

const app = express();
const server = http.createServer(app);

// ✅ Socket.IO setup with CORS
const io = new Server(server, {
  cors: {
    origin: '*', 
    methods: ['GET', 'POST'],
  },
});

//  Make `io` accessible in controllers
app.set('io', io);

//  Middleware
app.use(express.json());
app.use(cors());

//  Connect to MongoDB
dbConnect();

//  Routes
app.use('/v1/api', importLogRoutes);

// ✅ Socket connection check
io.on('connection', (socket) => {
  console.log('📡 Client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// ✅ Test route
app.get('/', (req, res) => res.send('Job Importer Running'));

// ✅ Cron job every hour
cron.schedule('0 * * * *', fetchJobsFromFeeds);

// ✅ Start server (NOTE: use `server.listen()` instead of `app.listen()`)
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(` Server listening on ${PORT}`);
});
