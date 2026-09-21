import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import { createServer as createViteServer } from 'vite';
import apiRouter from './server/api.ts';

const PORT = 3000;

async function startServer() {
  const app = express();

  // Core middlewares
  app.use(express.json({ limit: '20mb' }));
  app.use(express.urlencoded({ extended: true, limit: '20mb' }));
  app.use(cookieParser());

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      school: 'Albright Academy',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    });
  });

  // API router
  app.use('/api', apiRouter);

  // Vite integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Albright Academy Full-Stack server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
