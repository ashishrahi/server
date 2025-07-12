import Queue from 'bull';
import dotenv from 'dotenv';
dotenv.config();

const jobQueue = new Queue('job-import', process.env.REDIS_URL);
export default jobQueue;
