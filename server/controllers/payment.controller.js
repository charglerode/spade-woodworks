const stripe = require('stripe')(
  'sk_test_51R0xOiCIYtvEEQ0rKFkVE1ARKFST6dqyGdhZB8kiG48zCV5SvBmixocdusKOFQGcWDmltO8Gadi28GcHx78T1w8o006IVYMz2z',
);
const Product = require('../models/Product');
const catchAsync = require('../utils/catch');
const AppError = require('../utils/error');

exports.createPayment = catchAsync(async (req, res, next) => {
  const data = req.body;
  const paymentIntent = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: 'usd',
    // receipt_email: data.email,
    // metadata: {
    //   customerName: `${data.firstName} ${data.lastName}`,
    //   customerEmail: data.email,
    //   items: JSON.stringify(data.cart),
    // },
    // receipt_email: data.email,
  });

  res.status(200).json({
    status: 'success',
    clientSecret: paymentIntent.client_secret,
  });
});

exports.cancelPayment = catchAsync(async (req, res, next) => {
  const paymentIntent = await stripe.paymentIntents.cancel(req.params.id);

  res.status(200).json({
    status: 'success',
    clientSecret: null,
  });
});
