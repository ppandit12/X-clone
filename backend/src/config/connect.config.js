import mongoose from "mongoose";
import env from "./env.config.js";

export const connectDB = async ()=>{
    try {
        console.log("inside the connectDB:", env);
      const connection = await mongoose.connect(env.mongodbUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB connected", connection.connection.host);
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
}
