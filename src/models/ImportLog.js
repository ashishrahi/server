import mongoose from 'mongoose';

const importLogSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  feedUrl: { type: String },
  totalFetched: { type: Number },
  totalImported: { type: Number },
  newJobs: { type: Number },
  updatedJobs: { type: Number },
  failedJobs: [
    {
      job: Object,
      reason: String
    }
  ]
});

const ImportLog = mongoose.model('ImportLog', importLogSchema);
export default ImportLog;
