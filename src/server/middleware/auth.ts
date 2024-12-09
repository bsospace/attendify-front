import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { ApiError } from '../utils/api-error';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const verifyToken = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new ApiError('Unauthorized', 401);
    }

    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded as AuthRequest['user'];
    next();
  } catch (error) {
    next(new ApiError('Invalid token', 401));
  }
};