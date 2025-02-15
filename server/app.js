const express = require('express');
const morgan = require('morgan');
const products = require('./routes/product.route');

const app = express();

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(express.json());

app.use('/api/v1/products', products);

app.all('*', (req, res, next) => {
    res.status(404).json({
        status: 'fail',
        message: `Can't find ${req.originalUrl}`
    });
});

module.exports = app;