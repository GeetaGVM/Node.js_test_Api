const express = require('express');
require('dotenv').config()
const port = process.env.PORT || 3000
const Routes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoute');
const notificationRoutes = require('./routes/notificationRoutes');
const sequelize = require('./dbconfig/db');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json'); 
const orderRoutes = require('./routes/orderRoutes');
const slideRoute = require('./routes/slideRoute');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
require('./dbconfig/db');
const { dashLogger } = require("./utils/logger");

const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.use('/', Routes);
app.use('/',productRoutes);
app.use('/', notificationRoutes);
app.use('/',orderRoutes);
app.use('/',slideRoute)
app.use('/',subscriptionRoutes)


// Handle undefined routes
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  dashLogger.error(`${err}, \nRequest: ${req.originalUrl}, \nRequest Params: ${JSON.stringify(req.query)}, \nRequest Body: ${JSON.stringify(req.body)}`);
  res.status(500).json({ message: 'Something went wrong' });
});


sequelize.sync({ force: false })
  .then(() => {
    console.log('Sequelize models synced with the database');
    // Start the server after syncing
    app.listen(port, () => {
      console.log(`Server starts on localhost ${port}`);
    });
  })
  .catch((error) => {
    console.error('Error syncing Sequelize models:', error);
});

