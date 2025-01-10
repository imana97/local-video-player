import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import authRouter from './routes/auth';

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use('/auth', authRouter);

const SECRET_KEY = 'your_secret_key';

// Extend the Request interface to include the user property
interface AuthenticatedRequest extends Request {
  user?: any;
}

// Middleware to protect routes
const authenticateJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
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

// Protected route
app.get('/main', authenticateJWT, (req: AuthenticatedRequest, res: Response) => {
  res.json({ message: `Welcome ${req.user.username}` });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
