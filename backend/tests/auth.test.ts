import request from 'supertest';
import express from 'express';
import bcrypt from 'bcrypt';
import authRoutes from '../src/routes/auth';
import { expect, describe, it, beforeAll, afterAll, beforeEach, jest } from '@jest/globals';
import mongoose from 'mongoose';
import UserModel from '../src/models/User';
import { MONGO_TEST_URL } from '../src/config';

const app = express();
app.use(express.json());
app.use('/auth', authRoutes);

beforeAll(async () => {
  await mongoose.connect(MONGO_TEST_URL, {});
});

afterAll(async () => {
  if (mongoose.connection.db) {
    await mongoose.connection.db.dropDatabase();
  }
  await mongoose.connection.close();
});

describe('Auth Routes', () => {
  beforeEach(async () => {
    await UserModel.deleteMany({});
  });

  it('should register a new user', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({ username: 'testuser', password: 'testpass' });
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('User registered successfully');
  });

  it('should not register an existing user', async () => {
    await request(app)
      .post('/auth/register')
      .send({ username: 'testuser', password: 'testpass' });
    const response = await request(app)
      .post('/auth/register')
      .send({ username: 'testuser', password: 'testpass' });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('User already exists');
  });

  it('should login an existing user', async () => {
    const hashedPassword = await bcrypt.hash('testpass', 10);
    await new UserModel({ username: 'testuser', password: hashedPassword }).save();
    const response = await request(app)
      .post('/auth/login')
      .send({ username: 'testuser', password: 'testpass' });
    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
  });

  it('should not login with invalid credentials', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({ username: 'invaliduser', password: 'invalidpass' });
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Invalid credentials');
  });

  it('should return 500 for server errors during registration', async () => {
    jest.spyOn(UserModel.prototype, 'save').mockImplementationOnce(() => {
      throw new Error('Mocked error');
    });
    const response = await request(app)
      .post('/auth/register')
      .send({ username: 'testuser', password: 'testpass' });
    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Internal server error');
  });

  it('should return 500 for server errors during login', async () => {
    jest.spyOn(UserModel, 'findOne').mockImplementationOnce(() => {
      throw new Error('Mocked error');
    });
    const response = await request(app)
      .post('/auth/login')
      .send({ username: 'testuser', password: 'testpass' });
    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Internal server error');
  });
});
