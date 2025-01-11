import mongoose, { Schema, Document } from 'mongoose';

// Define the Video interface extending mongoose Document
export interface Video extends Document {
  name: string;
  description: string;
  tags: string[];
  url: string;
  uploadedBy: mongoose.Types.ObjectId;
}

// Define the Video schema
const videoSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  tags: { type: [String], required: true },
  url: { type: String, required: true },
  uploadedBy: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
});

// Create the Video model
const VideoModel = mongoose.model<Video>('Video', videoSchema);

export default VideoModel;
