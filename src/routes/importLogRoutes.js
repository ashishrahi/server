import express from 'express';
import { fetchJobsFromFeeds } from '../services/JobService.js';
import { getImportLogs } from '../controllers/importLogController.js';
import {createImportLogs, updateImportLogs} from '../controllers/importLogController.js'

const router = express.Router();

router.get('/import-logs', getImportLogs);
router.post('/logs/create', createImportLogs);
router.put('/logs/:id', updateImportLogs);



router.post('/manual-import', async (req, res) => {
  const stats = await fetchJobsFromFeeds();
  res.json({
    message: 'Import started',
    stats,
  });
});

export default router;
