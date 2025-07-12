import ImportLog from '../models/ImportLog.js'

export const createImportLog= async(model)=>{
    try {
     const newImageLog = new ImportLog({...model})
     await newImageLog.save()
     return{
        success: true,
        message: 'log created successfully',
     }
        
    } catch (error) {
         return{
            success: false,
            message: error.message
         }        
    }
}

export const updateImportLogs = async (model, item) => {
  try {
    // Convert to plain object to safely access `id`
    const id = model?.id || model?.['id'];

    if (!id) {
      return {
        success: false,
        message: "Invalid ID",
      };
    }

    const updated = await ImportLog.findByIdAndUpdate(id, item, { new: true });

    if (!updated) {
      return {
        success: false,
        message: "Log not found",
      };
    }

    return {
      success: true,
      message: "Log updated successfully",
      data: updated,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Update failed",
    };
  }
};