import axios from 'axios';
import { parseStringPromise } from 'xml2js';
import { feeds } from '../data/feeds.js';
import jobQueue from '../queues/jobQueue.js';
import ImportLog from '../models/ImportLog.js';

export const fetchJobsFromFeeds = async () => {
  const importStats = [];

  for (const url of feeds) {
    let totalFetched = 0;
    let totalQueued = 0;
    let failedJobs = [];

    try {
      const { data } = await axios.get(url);
      const result = await parseStringPromise(data);
      const channel = result?.rss?.channel?.[0];
      const jobs = Array.isArray(channel?.item) ? channel.item : [];

      totalFetched = jobs.length;


      for (const job of jobs) {
        try {
          await jobQueue.add('importJob', { feedUrl: url, job });
          totalQueued++;
        } catch (err) {
          failedJobs.push({ job, reason: err.message });
        }
      }


    } catch (err) {
      failedJobs.push({ job: null, reason: err.message });
    }

    const log = new ImportLog({
      feedUrl: url,
      totalFetched,
      totalImported: totalQueued,
      newJobs: 0,
      updatedJobs: 0,
      failedJobs,
    });

    await log.save();

    importStats.push({
      feedUrl: url,
      totalFetched,
      totalQueued,
      failedCount: failedJobs.length,
    });
  }

  return importStats;
};
