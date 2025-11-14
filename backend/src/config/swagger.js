const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'User Auth Demo API',
      version: '1.0.0',
      description: 'Microservices API with JWT Authentication and RBAC',
      contact: {
        name: 'API Support',
        email: 'support@example.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:4000',
        description: 'Main API Server'
      },
      {
        url: 'http://localhost:4001',
        description: 'User Service'
      },
      {
        url: 'http://localhost:4002',
        description: 'Analytics Service'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token obtained from Asgardeo login'
        }
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              example: 'Access Denied'
            },
            message: {
              type: 'string',
              example: 'This endpoint requires admin role'
            }
          }
        },
        UserInfo: {
          type: 'object',
          properties: {
            userId: {
              type: 'string',
              example: 'user-123'
            },
            email: {
              type: 'string',
              example: 'user@example.com'
            },
            username: {
              type: 'string',
              example: 'john_doe'
            },
            roles: {
              type: 'array',
              items: {
                type: 'string'
              },
              example: ['admin', 'user']
            },
            fullName: {
              type: 'string',
              example: 'John Doe'
            },
            isAdmin: {
              type: 'boolean',
              example: true
            }
          }
        },
        DashboardStats: {
          type: 'object',
          properties: {
            totalUsers: {
              type: 'number',
              example: 156
            },
            activeUsers: {
              type: 'number',
              example: 89
            },
            newUsers: {
              type: 'number',
              example: 12
            },
            apiCalls: {
              type: 'number',
              example: 2547
            }
          }
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  apis: ['./src/server.js', './src/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
