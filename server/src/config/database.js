import mongoose from "mongoose"

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`[SUCCESS-CONNECTED]: MongoDB Connected --> ${conn.connection.host}`);
    } catch (error) {
        console.log(`[ERROR]: ${error.message}`);
        process.exit(1);
    }
}