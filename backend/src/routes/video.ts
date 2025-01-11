import { Router, Response, RequestHandler } from 'express';
import multer from 'multer';
import mongoose from 'mongoose';
import VideoModel from '../models/Video';
import { AuthenticatedRequest } from '../types';
import path from 'path';

const router = Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const videoId = new mongoose.Types.ObjectId();
    cb(null, `${videoId}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 40 * 1024 * 1024 * 1024 }, // 40GB
});

// Upload video
const uploadVideoHandler: RequestHandler = async (req: AuthenticatedRequest, res: Response):Promise<void> => {
  const { name, description, tags } = req.body;
  const file = req.file;
  if (!file) {
    console.error('No file uploaded');
    res.status(400).json({ message: 'No file uploaded' });
    return;
  }
  if (!req.user) {
    console.error('User not authenticated');
    res.status(403).json({ message: 'User not authenticated' });
    return;
  }
  try {
    const newVideo = new VideoModel({
      name,
      description,
      tags,
      url: file.path,
      uploadedBy: req.user._id,
    });
    await newVideo.save();
    res.status(201).json({ message: 'Video uploaded successfully', videoId: newVideo._id });
  } catch (error) {
    console.error('Error uploading video', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all videos uploaded by the user
const getUserVideosHandler: RequestHandler = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const videos = await VideoModel.find({ uploadedBy: req.user._id }).populate('uploadedBy', 'username');
    res.json(videos);
  } catch (error) {
    console.error('Error retrieving user videos', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get videos by tag uploaded by the user
const getUserVideosByTagHandler: RequestHandler = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { tag } = req.params;
  try {
    const videos = await VideoModel.find({ tags: tag, uploadedBy: req.user._id }).populate('uploadedBy', 'username');
    res.json(videos);
  } catch (error) {
    console.error('Error retrieving videos by tag', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Define routes
router.post('/upload', upload.single('video'), uploadVideoHandler);
router.get('/all', getUserVideosHandler);
router.get('/tag/:tag', getUserVideosByTagHandler);

export default router;
