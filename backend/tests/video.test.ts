import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import videoRouter from '../src/routes/video';
import { SECRET_KEY, CORS_WHITELIST_URL, MONGO_TEST_URL } from '../src/config';
import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import UserModel from '../src/models/User';
import VideoModel from '../src/models/Video';

const app = express();

app.use(cors({ origin: CORS_WHITELIST_URL }));
app.use(bodyParser.json());
app.use('/videos', videoRouter);

interface AuthenticatedRequest extends express.Request {
  user?: any;
}

const authenticateJWT = (req: AuthenticatedRequest, res: express.Response, next: express.NextFunction) => {
  const token = req.headers.authorization;
  if (!token) {
    res.sendStatus(403);
    return;
  }
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
};

app.use(authenticateJWT);

beforeAll(async () => {
  await mongoose.connect(MONGO_TEST_URL, {});
});

afterAll(async () => {
  if (mongoose.connection.db) {
    await mongoose.connection.db.dropDatabase();
  }
  await mongoose.connection.close();
});

describe('Video Routes', () => {
  let token: string;
  let userId: mongoose.Types.ObjectId;

  beforeEach(async () => {
    await UserModel.deleteMany({});
    await VideoModel.deleteMany({});
    const user = new UserModel({ username: 'testuser', password: 'testpass' });
    await user.save();
    userId = user._id as mongoose.Types.ObjectId;
    token = jwt.sign({ _id: userId, username: 'testuser' }, SECRET_KEY);
  });

  it('should upload a video', async () => {
    // Test case for uploading a video
    const response = await request(app)
      .post('/videos/upload')
      .set('Authorization', token)
      .field('name', 'Test Video')
      .field('description', 'Test Description')
      .field('tags', 'test')
      .attach('video', Buffer.from('test video content'), 'test.mp4');
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Video uploaded successfully');
  });

  it('should get all videos uploaded by the user', async () => {
    // Test case for retrieving all videos uploaded by the user
    const video = new VideoModel({
      name: 'Test Video',
      description: 'Test Description',
      tags: ['test'],
      url: 'uploads/test.mp4',
      uploadedBy: userId,
    });
    await video.save();
    const response = await request(app)
      .get('/videos/all')
      .set('Authorization', token);
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].name).toBe('Test Video');
  });

  it('should get videos by tag uploaded by the user', async () => {
    // Test case for retrieving videos by tag uploaded by the user
    const video = new VideoModel({
      name: 'Test Video',
      description: 'Test Description',
      tags: ['test'],
      url: 'uploads/test.mp4',
      uploadedBy: userId,
    });
    await video.save();
    const response = await request(app)
      .get('/videos/tag/test')
      .set('Authorization', token);
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].name).toBe('Test Video');
  });
});
