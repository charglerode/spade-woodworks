const express = require('express');
const morgan = require('morgan');
const productRouter = require('./routes/productRoutes');

const app = express();

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(express.json());

app.use('/api/v1/products', productRouter);

module.exports = app;