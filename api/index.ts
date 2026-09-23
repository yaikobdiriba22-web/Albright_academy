import type { IncomingMessage, ServerResponse } from 'http';
import express from 'express';
import cookieParser from 'cookie-parser';
import apiRouter from '../server/api.ts';

const app = express();

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
app.use(cookieParser());

// Mount the api router on both /api and / to handle different Vercel rewrite behaviors
app.use('/api', apiRouter);
app.use('/', apiRouter);

export default function handler(req: IncomingMessage, res: ServerResponse) {
  return (app as any)(req, res);
}
