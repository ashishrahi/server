import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cron from 'node-cron';
import importLogRoutes from './src/routes/importLogRoutes.js';
import { fetchJobsFromFeeds } from './src/services/JobService.js';
import dbConnect from './src/config/dbConnect.js';
import cors from 'cors'

dotenv.config();
const app = express();
app.use(express.json());
dbConnect()
app.use(cors())

app.use('/v1/api', importLogRoutes);

cron.schedule('0 * * * *', fetchJobsFromFeeds); 

app.get('/', (req, res) => res.send("Job Importer Running"));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
