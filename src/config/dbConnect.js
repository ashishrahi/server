import mongoose from 'mongoose'

const dbConnect = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Mongodb Connected")
    } catch (error) {
        console.error("Mongodb Error:", error.message)
        process.exit(1)
    }
}
export default dbConnect