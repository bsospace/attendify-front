import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { config } from './config';
import { authRoutes } from './routes/auth.routes';
import { ApiError } from './utils/api-error';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: config.clientUrl,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/auth', authRoutes);

// Error handling
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err instanceof ApiError) {
    return res.status(err.status).json({
      error: {
        message: err.message,
        details: err.details,
      },
    });
  }

  console.error(err);
  res.status(500).json({
    error: {
      message: 'Internal server error',
    },
  });
});

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});