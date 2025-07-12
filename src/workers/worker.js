import 'dotenv/config';
import mongoose from 'mongoose';
import { Worker } from 'bullmq';
import Job from '../models/Job.js';

await mongoose.connect(process.env.MONGO_URI);

const extractJobData = (job) => {
  return {
    jobId: job.guid?.[0]?._ || job.guid?.[0],
    title: job.title?.[0] || 'Untitled',
    company: job['job_listing:company']?.[0] || 'Unknown Company',
    url: job.link?.[0] || '',
    publishedDate: job.pubDate?.[0] ? new Date(job.pubDate[0]) : null,
  };
};

const worker = new Worker('jobs', async (job) => {
  const { job: jobData, feedUrl } = job.data;

  const jobInfo = extractJobData(jobData);

  try {
    await Job.updateOne(
      { jobId: jobInfo.jobId },
      { $set: jobInfo },
      { upsert: true }
    );
  } catch (err) {
    throw err;
  }
}, {
  connection: { host: 'localhost', port: 6379 },
});
