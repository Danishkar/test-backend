import mongoose from "mongoose";

export interface ProfileType extends mongoose.Document {
  email: string;
  password: string;
  name?: string;
  profilePic?: string;
}

const profileSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  name: { type: String },
  profilePic: { type: String },
});

export const Profile = mongoose.model<ProfileType>("Profile", profileSchema);