import express from 'express';
import { getImportLogs } from '../controllers/importLogController.js';
import {createImportLogs, updateImportLogs} from '../controllers/importLogController.js'
import { fetchJobsFromFeeds } from '../services/JobService.js';
const router = express.Router();

router.post('/logs/create', createImportLogs);
router.get('/import-logs', getImportLogs);
router.put('/logs/:id', updateImportLogs);



router.post('/manual-import', async (req, res) => {
  const stats = await fetchJobsFromFeeds();
  res.json({
    message: 'Import started',
    stats,
  });
});

export default router;
