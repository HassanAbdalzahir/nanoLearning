import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: { _id: string };
}

export const verifyJWT = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  let token: string | undefined;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  if (!token) {
    res
      .status(401)
      .json({ error: { message: 'No token provided', statusCode: 401 } });
    return;
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env['JWT_SECRET'] || 'secret'
    ) as { userId: string };
    req.user = { _id: decoded.userId };
    next();
  } catch {
    res
      .status(401)
      .json({ error: { message: 'Invalid token', statusCode: 401 } });
  }
};

export const auth = verifyJWT;
