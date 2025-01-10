import request from 'supertest';
import express from 'express';
import authRoutes from '../src/routes/auth';
import { expect, describe, it } from '@jest/globals';

const app = express();
app.use(express.json());
app.use('/auth', authRoutes);

describe('Auth Routes', () => {
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
    await request(app)
      .post('/auth/register')
      .send({ username: 'testuser', password: 'testpass' });
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
});
