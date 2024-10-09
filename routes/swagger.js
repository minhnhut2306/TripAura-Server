// swagger.js
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Documentation',
            version: '1.0.0',
            description: 'API Documentation for your Node.js project',
        },
        tags: [
            {
                name: "User", 
                description: ""
            },
            {
                name: "Booking", 
                description: ""
            },
        ],
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Local server',
            },
            {
                url: 'https://trip-aura-server-git-main-minhnhut2306s-projects.vercel.app',
                description: 'Production server',
            },
        ],
    },
    apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
