import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';
import cors from 'cors';
import authRouter from '../src/routes/auth';
import { describe, it, expect } from '@jest/globals';
import { SECRET_KEY } from '../src/config';

const app = express();

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(bodyParser.json());
app.use('/auth', authRouter);

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

app.get('/main', authenticateJWT, (req: AuthenticatedRequest, res: express.Response) => {
  res.json({ message: `Welcome ${req.user.username}` });
});

describe('Server', () => {
  it('should return 403 if no token is provided', async () => {
    const response = await request(app).get('/main');
    expect(response.status).toBe(403);
  });

  it('should return 403 if token is invalid', async () => {
    const response = await request(app)
      .get('/main')
      .set('Authorization', 'invalid_token');
    expect(response.status).toBe(403);
  });

  it('should return 200 and welcome message if token is valid', async () => {
    const token = jwt.sign({ username: 'testuser' }, SECRET_KEY);
    const response = await request(app)
      .get('/main')
      .set('Authorization', token);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Welcome testuser');
  });
});
