import request from 'supertest';
import express from 'express';
import bcrypt from 'bcrypt';
import authRoutes from '../src/routes/auth';
import { expect, describe, it, beforeAll, afterAll, beforeEach, jest } from '@jest/globals';
import mongoose from 'mongoose';
import UserModel from '../src/models/User';
import { MongoMemoryServer } from 'mongodb-memory-server';

const app = express();
app.use(express.json());
app.use('/auth', authRoutes);

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

describe('Auth Routes', () => {
  beforeEach(async () => {
    await UserModel.deleteMany({});
  });

  it('should register a new user', async () => {
    // Test case for registering a new user
    const response = await request(app)
      .post('/auth/register')
      .send({ username: 'testuser', password: 'testpass' });
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('User registered successfully');
  });

  it('should not register an existing user', async () => {
    // Test case for handling registration of an existing user
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
    // Test case for logging in an existing user
    const hashedPassword = await bcrypt.hash('testpass', 10);
    await new UserModel({ username: 'testuser', password: hashedPassword }).save();
    const response = await request(app)
      .post('/auth/login')
      .send({ username: 'testuser', password: 'testpass' });
    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
  });

  it('should not login with invalid credentials', async () => {
    // Test case for handling login with invalid credentials
    const response = await request(app)
      .post('/auth/login')
      .send({ username: 'invaliduser', password: 'invalidpass' });
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Invalid credentials');
  });

  it('should return 500 for server errors during registration', async () => {
    // Test case for handling server errors during registration
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
    // Test case for handling server errors during login
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
