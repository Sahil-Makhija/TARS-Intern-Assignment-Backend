import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI as string
      // TODO: Add mongoose options{
      //     useNewUrlParser: true,
      //     useUnifiedTopology: true,
      //   } as mongoose.ConnectOptions
    );
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1);
  }
};
