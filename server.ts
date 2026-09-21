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

  // Static assets from public folder (accessible as /public/... and root)
  const publicPath = path.join(process.cwd(), 'public');
  app.use('/public', express.static(publicPath));
  app.use(express.static(publicPath));

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

  // Catch unmatched API requests and return clean JSON (preventing Vite SPA HTML fallback)
  app.all(['/api', '/api/*'], (req, res) => {
    res.status(404).json({ error: `API endpoint not found: ${req.method} ${req.originalUrl}` });
  });

  // Global Express error handler for API routes
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (req.path.startsWith('/api')) {
      console.error('API Error:', err);
      res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
      return;
    }
    next(err);
  });

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
