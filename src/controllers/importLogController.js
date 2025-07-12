import  ImportLog  from '../models/ImportLog.js';

export const getImportLogs = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const logs = await ImportLog.find()
    .sort({ timestamp: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
  const count = await ImportLog.countDocuments();
  res.json({ logs, totalPages: Math.ceil(count / limit), currentPage: page });
};

