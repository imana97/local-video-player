import { Router, Request, Response, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

const router = Router();

interface User {
  username: string;
  password: string;
}

interface AuthRequest extends Request {
  body: {
    username: string;
    password: string;
  }
}

const users: User[] = [];
const SECRET_KEY = 'your_secret_key';

// Registration route
const registerHandler: RequestHandler = (req: AuthRequest, res: Response) => {
  const { username, password } = req.body;
  if (users.find(user => user.username === username)) {
    res.status(400).json({ message: 'User already exists' });
    return;
  }
  users.push({ username, password });
  res.status(201).json({ message: 'User registered successfully' });
};

// Login route
const loginHandler: RequestHandler = (req: AuthRequest, res: Response): void => {
  const { username, password } = req.body;
  const user = users.find(user => user.username === username && user.password === password);
  if (!user) {
    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }
  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
  res.json({ token });
};

router.post('/register', registerHandler);
router.post('/login', loginHandler);

export default router;
