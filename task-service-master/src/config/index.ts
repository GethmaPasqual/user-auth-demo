import dotenv from 'dotenv';

dotenv.config();

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '4000', 10),
  apiVersion: process.env.API_VERSION || 'v1',
  serviceName: process.env.SERVICE_NAME || 'task-service',
  logLevel: process.env.LOG_LEVEL || 'info',
  auth: {
    jwksUri: process.env.JWT_JWKS_URI || 'https://api.asgardeo.io/t/testforfinalproject/oauth2/jwks',
    audience: process.env.JWT_AUDIENCE || 'KYEfJzks5uXRratlXxNpS9dvpRQa',
    issuer: process.env.JWT_ISSUER || 'https://api.asgardeo.io/t/testforfinalproject/oauth2/token',
    algorithms: ['RS256'] as const,
  },
  grpc: {
    port: parseInt(process.env.GRPC_PORT || '50052', 10),
    projectServiceUrl: process.env.PROJECT_SERVICE_GRPC_URL || 'localhost:50051',
  },
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    name: process.env.DB_NAME || 'taskdb',
    user: process.env.DB_USER || 'taskuser',
    password: process.env.DB_PASSWORD || 'taskpass',
    poolMin: parseInt(process.env.DB_POOL_MIN || '2', 10),
    poolMax: parseInt(process.env.DB_POOL_MAX || '10', 10),
  },
  rabbitmq: {
    url: process.env.RABBITMQ_URL || 'amqp://admin:admin123@rabbitmq:5672',
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },
};

export const isProduction = config.env === 'production';
export const isDevelopment = config.env === 'development';

export default config;
