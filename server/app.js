const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/error');
const errorHandler = require('./controllers/error.controller');
const products = require('./routes/product.route');
const users = require('./routes/user.route');
const inventory = require('./routes/inventory.route');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

app.use('/api/v1/products', products);
app.use('/api/v1/users', users);
app.use('/api/v1/inventory', inventory);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl}`, 404));
});

app.use(errorHandler);

module.exports = app;
