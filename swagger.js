const fs = require('fs');
const swaggerJsdoc = require('swagger-jsdoc');

// Configure swagger-jsdoc
const options = {
  swaggerDefinition: {
    swagger: '2.0',
    info: {
      title: 'E-Commerce API',
      version: '1.0.0',
      description: 'API documentation for Users, Products, and Orders',
    },
    host: 'cse341-kachi-project-wk3-wk4.onrender.com',
    basePath: '/',
    schemes: ['https'],
  },
  apis: ['./routes/*.js'], // <--- point to your route files
};

// Generate swagger specification
const swaggerSpec = swaggerJsdoc(options);

// Write the swagger.json file
fs.writeFileSync('swagger.json', JSON.stringify(swaggerSpec, null, 2));
console.log('✅ swagger.json generated successfully!');
