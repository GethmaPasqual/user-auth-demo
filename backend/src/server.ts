import express, { Application } from 'express';
import cors from 'cors';
import apiRoutes from './routes/api.routes';
import { errorHandler } from './middleware/error.middleware';
import { serverConfig } from './config/auth.config';

/**
 * Initialize Express Application
 */
const app: Application = express();

/**
 * Middleware
 */
app.use(cors({
  origin: serverConfig.corsOrigin,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Routes
 */
app.use('/api', apiRoutes);

/**
 * Health check endpoint
 */
app.get('/health', (_req, res) => {
  res.json({ 
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

/**
 * Error handling middleware (must be last)
 */
app.use(errorHandler);

/**
 * Start Server
 */
const PORT = serverConfig.port;
app.listen(PORT, () => {
  console.log(`✅ Express TypeScript server listening on http://localhost:${PORT}`);
  console.log(`📋 Available endpoints:`);
  console.log(`   - GET /health (Health check)`);
  console.log(`   - GET /api/public (No auth required)`);
  console.log(`   - GET /api/private (JWT required)`);
  console.log(`   - GET /api/admin (JWT + Admin role required)`);
  console.log(`🔐 CORS enabled for: ${serverConfig.corsOrigin}`);
});

export default app;
