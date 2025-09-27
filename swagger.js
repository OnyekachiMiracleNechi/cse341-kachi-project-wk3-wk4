const fs = require('fs');
const swaggerJsdoc = require('swagger-jsdoc');

// Swagger definition configuration
const options = {
  swaggerDefinition: {
    swagger: '2.0',
    info: {
      title: 'E-Commerce API',
      version: '1.0.0',
      description: 'API documentation for Users, Products, and Orders',
    },
    host:  'cse341-kachi-project-wk3-wk4.onrender.com', // Change for local/testing
    basePath: '/',
    schemes: ['https'],
    securityDefinitions: {
      Bearer: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header',
        description: 'Enter your JWT token like: Bearer <token>',
      },
    },
  },
  apis: ['./routes/*.js'], // Path to your route files
};

// Generate swagger specification
const swaggerSpec = swaggerJsdoc(options);

// Write the swagger.json file
fs.writeFileSync('swagger.json', JSON.stringify(swaggerSpec, null, 2));

console.log('✅ swagger.json generated successfully!');
