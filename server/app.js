const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
const AppError = require('./utils/error');
const errorHandler = require('./controllers/error.controller');
const products = require('./routes/product.route');
const users = require('./routes/user.route');
const inventory = require('./routes/inventory.route');
const contact = require('./routes/contact.route');
const quotes = require('./routes/quotes.route');

const app = express();

// CORS, TURN OFF IN PRODUCTION
app.use(cors());
app.options('*', cors());

app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'pug');

app.use(helmet());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour',
});
app.use('/api', limiter);

app.use(express.json({ limit: '10kb' }));

app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

app.use('/api/v1/products', products);
app.use('/api/v1/users', users);
app.use('/api/v1/inventory', inventory);
app.use('/api/v1/contact', contact);
app.use('/api/v1/quotes', quotes);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl}`, 404));
});

app.use(errorHandler);

module.exports = app;
