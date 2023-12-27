const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swagger.json'
const endpointsFiles = ['./server.js']

const doc = {
    info: {
        title: 'Test API',
        version: "1.0.0",
    },
    host: 'localhost:3000',
    basePath: '/',
    schemes: ['http'],
}

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    require('./server.js'); // project's root file
  });
