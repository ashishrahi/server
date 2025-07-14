import { StatusCodes } from "http-status-codes";
import ImportLog from "../models/ImportLog.js";
import { ImportLogService } from "../services/index.js";
export const getImportLogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const logs = await ImportLog.find()
      .sort({ timestamp: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    const count = await ImportLog.countDocuments();
    res.json({ logs, totalPages: Math.ceil(count / limit), currentPage: page });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: error.message });
  }
};

export const createImportLogs = async (req, res,) => {
  try {
    const model = req.body;
    const { success, message, data } = await ImportLogService.createImportLog(
      model
    );
     const io = req.app.get('io');
    if (success && io) {
      io.emit('new-log', data); 
    }
    res.status(StatusCodes.OK).json({ success, message, data });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: error.message });
  }
};

export const updateImportLogs = async(req, res)=>{
  try {
       const model = req.params;
       const item = req.body;
    
       const {success, message, data} = await ImportLogService.updateImportLogs(model,item)
       res.status(StatusCodes.OK).json({success, message})
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({success, messsage: error.message})
  }
}
