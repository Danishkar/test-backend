import mongoose from "mongoose";
import { MONGO_CONNECTION_STRING } from "./envConfig.js";

const connectDb = async () => {
  try {
    await mongoose.connect(MONGO_CONNECTION_STRING);
    console.log("Connected to Database");
  } catch (err) {
    console.error(err);
  }
};

export default connectDb;