import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { ApiError } from '../utils/api-error';

export class AuthController {

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      console.log(email, password);
      

      const user = { id: '1', email, password: '' };

      const token = jwt.sign(
        { id: user.id, email: user.email },
        config.jwtSecret,
        { expiresIn: config.jwtExpiresIn }
      );

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: config.cookieMaxAge,
      });

      res.json({ message: 'Login successful' });
    } catch (error) {
      next(error);
    }
  }

  static async logout(req: Request, res: Response) {
    res.clearCookie('token');
    res.json({ message: 'Logout successful' });
  }

  static async verify(req: Request, res: Response, next: NextFunction) {
    try {
      const { token } = req.query;

      if (!token) {
        throw new ApiError('Verification token is required', 400);
      }

      const decoded = jwt.verify(token as string, config.jwtSecret);

      // Update user verification status (implement your database logic here)

      res.json({ message: 'Email verified successfully' });
    } catch (error) {
      next(error);
    }
  }
}