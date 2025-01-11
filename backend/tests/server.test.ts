import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';
import cors from 'cors';
import bcrypt from 'bcrypt';
import authRouter from '../src/routes/auth';
import videoRouter from '../src/routes/video';
import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from '@jest/globals';
import { SECRET_KEY, CORS_WHITELIST_URL } from '../src/config';
import mongoose from 'mongoose';
import UserModel from '../src/models/User';
import VideoModel from '../src/models/Video';
import { MongoMemoryServer } from 'mongodb-memory-server';
import fs from 'fs';
import path from 'path';

const app = express();

app.use(cors({ origin: CORS_WHITELIST_URL }));
app.use(bodyParser.json());
app.use('/auth', authRouter);
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

app.get('/main', (req: AuthenticatedRequest, res: express.Response) => {
  res.status(200).json({ message: `Welcome ${req.user.username}` });
});

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, {});
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  const uploadDir = path.join(__dirname, '../uploads');
  fs.readdir(uploadDir, (err, files) => {
    if (err) throw err;
    for (const file of files) {
      fs.unlink(path.join(uploadDir, file), err => {
        if (err) throw err;
      });
    }
  });
});

describe('Server', () => {
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

  it('should return 403 if no token is provided', async () => {
    // Test case for handling requests without a token
    const response = await request(app).get('/main');
    expect(response.status).toBe(403);
  });

  it('should return 403 if token is invalid', async () => {
    // Test case for handling requests with an invalid token
    const response = await request(app)
      .get('/main')
      .set('Authorization', 'invalid_token');
    expect(response.status).toBe(403);
  });

  it('should return 200 and welcome message if token is valid', async () => {
    // Test case for handling requests with a valid token
    const hashedPassword = await bcrypt.hash('testpass', 10);
    const token = jwt.sign({ username: 'testuser', password: hashedPassword }, SECRET_KEY);
    const response = await request(app)
      .get('/main')
      .set('Authorization', token);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Welcome testuser');
  });
});
