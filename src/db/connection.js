import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const connectionInstamnce = await mongoose.connect(
      `${process.env.MONGODB_URI}/${process.env.MONGODB_NAME}`
    );
    console.log(
      `MongoDB connected Successfully. Host at: ${connectionInstamnce.connection.host}`
    );
  } catch (error) {
    console.log("MongoDB connection failed.", error);
  }
};
