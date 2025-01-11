import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import authRouter from './routes/auth';
import videoRouter from './routes/video';
import { SECRET_KEY, MONGO_URL, CORS_WHITELIST_URL, PORT } from './config';
import fs from 'fs';
import path from 'path';

const app = express();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Middleware setup
app.use(cors({ origin: CORS_WHITELIST_URL }));
app.use(bodyParser.json());
app.use('/auth', authRouter);

// MongoDB connection
mongoose.connect(MONGO_URL, {
  // ...existing code...
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Failed to connect to MongoDB', err);
});

// Extend the Request interface to include the user property
interface AuthenticatedRequest extends Request {
  user?: any;
}

// Middleware to protect routes
const authenticateJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    console.error('No token provided');
    res.sendStatus(403);
    return;
  }
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      console.error('Token verification failed', err);
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
};

// Protected route
app.get('/main', authenticateJWT, (req: AuthenticatedRequest, res: Response) => {
  res.json({ message: `Welcome ${req.user.username}` });
});

// Use video routes
app.use('/videos', authenticateJWT, videoRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
