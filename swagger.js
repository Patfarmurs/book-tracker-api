const swaggerAutogen = require('swagger-autogen')();
const doc = {
    info: {
        title: 'Book Review API',
        description: 'API for tracking books and reviews',
    },
    host: 'book-tracker-api-m2h1.onrender.com',
    schemes: ['http'],
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);