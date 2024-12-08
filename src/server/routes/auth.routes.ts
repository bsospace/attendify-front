import { Router } from 'express';
import { body } from 'express-validator';
import { AuthController } from '../controllers/auth.controller';
import { validate } from '../middleware/validate';
import { authLimiter } from '../middleware/rate-limit';
import { verifyToken } from '../middleware/auth';

const router = Router();

const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
];

router.post(
  '/login',
  authLimiter,
  validate(loginValidation),
  AuthController.login
);

router.post('/logout', verifyToken, AuthController.logout);

router.get('/verify', AuthController.verify);

router.get('/me', verifyToken, (req, res) => {
  res.json({ user: req.user });
});

export { router as authRoutes };