import express from 'express';
import cookieParser from 'cookie-parser';
import type { Request, Response } from 'express';
import apiRouter from '../server/api.ts';

const app = express();

app.disable('x-powered-by');
app.set('trust proxy', 1);

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
app.use(cookieParser());

/**
 * Vercel invokes this function for /api/* requests.
 * The router itself contains routes such as /auth/login, /admin/stats, etc.
 * We mount it at /api so Express sees the same path shape in local and
 * production environments.
 */
app.use('/api', apiRouter);

/**
 * Never let API requests fall through to the SPA.
 */
app.use('/api', (_req: Request, res: Response) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

export default function handler(req: Request, res: Response) {
  return app(req, res);
}
