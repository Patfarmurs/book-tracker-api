const swaggerAutogen = require('swagger-autogen')();
const doc = {
    info: {
        title: 'Book Review API',
        description: 'API for tracking books and reviews',
    },
    host: 'localhost:3000',
    schemes: ['http'],
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);