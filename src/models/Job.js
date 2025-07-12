import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  jobId: { type: String, required: true, unique: true }, 
  title: String,
  company: String,
  url: String,
  publishedDate: Date,
});

const Job = mongoose.model('Job', jobSchema);
export default Job;
