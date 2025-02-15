const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/error');
const errorHandler = require('./controllers/error.controller');
const products = require('./routes/product.route');

const app = express();

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(express.json());

app.use('/api/v1/products', products);

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl}`, 404));
});

app.use(errorHandler);

module.exports = app;