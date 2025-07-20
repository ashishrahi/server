import 'dotenv/config';
import mongoose from 'mongoose';
import { Worker } from 'bullmq';
import Job from '../models/Job.js';
import logger from '../utilis/logger.js';

// MongoDB connection
try {
  await mongoose.connect(process.env.MONGO_URI);
  logger.info('MongoDB connected');
} catch (err) {
  logger.error(' MongoDB connection failed:', err);
  process.exit(1);
}

// Job data extractor
const extractJobData = (job) => {
  return {
    jobId: job.guid?.[0]?._ || job.guid?.[0],
    title: job.title?.[0] || 'Untitled',
    company: job['job_listing:company']?.[0] || 'Unknown Company',
    url: job.link?.[0] || '',
    publishedDate: job.pubDate?.[0] ? new Date(job.pubDate[0]) : null,
  };
};

// Initialize BullMQ Worker
const worker = new Worker(
  'jobs',
  async (job) => {
    const { job: jobData, feedUrl } = job.data;
    const jobInfo = extractJobData(jobData);

    if (!jobInfo.jobId) {
      logger.warn(`Skipping job with missing jobId from feed: ${feedUrl}`);
      return;
    }

    try {
      await Job.updateOne(
        { jobId: jobInfo.jobId },
        { $set: jobInfo },
        { upsert: true }
      );
      logger.info(`✅ Job processed: ${jobInfo.jobId}`);
    } catch (err) {
      logger.error(`Job processing error for ${jobInfo.jobId}: ${err.stack || err}`);
    }
  },
  {
    connection: {
      host: process.env.REDIS_HOST,  
      port: parseInt(process.env.REDIS_PORT),
    },
  }
);

// Worker event listeners
worker.on('completed', (job) => {
  logger.info(`🎉 Job ${job.id} completed`);
});

worker.on('failed', (job, err) => {
  logger.error(`Job ${job.id} failed: ${err.message}`);
});

logger.info('Worker started and listening to "jobs" queue');

// Graceful shutdown
process.on('SIGINT', async () => {
  logger.info('Gracefully shutting down...');
  await worker.close();
  await mongoose.disconnect();
  process.exit(0);
});

export default worker;
