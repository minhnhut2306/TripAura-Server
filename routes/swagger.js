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
            { name: "User", description: "User-related operations" },
            { name: "Booking", description: "Booking-related operations" },
            { name: "Category", description: "Category-related operations" },
            { name: "Detail", description: "Detail-related operations" },
            { name: "Favourite", description: "Favourite-related operations" },
            { name: "Image", description: "Image-related operations" },
            { name: "Location", description: "Location-related operations" },
            { name: "Review", description: "Review-related operations" },
            { name: "Tour", description: "Tour-related operations" },
            { name: "Voucher", description: "Voucher-related operations" },
            { name: "VoucherType", description: "VoucherType-related operations" }
        ],
        servers: [
            { url: 'https://trip-aura-server.vercel.app/', description: 'Production server' },
            { url: 'https://trip-aura-server-git-main-minhnhut2306s-projects.vercel.app/', description: 'Production server' }
        ],
    },
    apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
        swaggerOptions: {
            docExpansion: 'none',
            defaultModelsExpandDepth: -1  
        }
    }));
};
