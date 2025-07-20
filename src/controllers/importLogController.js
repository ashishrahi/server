import { StatusCodes } from "http-status-codes";
import ImportLog from "../models/ImportLog.js";
import { ImportLogService } from "../services/index.js";

export const getImportLogs = async (req, res) => {
  try {
    // Correct parameter names
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    // Optional: Validate values
    if (page < 1 || limit < 1 || limit > 100) {
      return res.status(400).json({ success: false, message: "Invalid page or limit" });
    }

    const logs = await ImportLog.find()
      .sort({ timestamp: -1 })
      .skip((page - 1) * limit)
      .limit(limit); // use limit here

    const count = await ImportLog.countDocuments();

    res.status(200).json({
      logs,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
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
