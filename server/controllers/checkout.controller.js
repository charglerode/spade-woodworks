const stripe = require('stripe')(
  'sk_test_51R0xOiCIYtvEEQ0rKFkVE1ARKFST6dqyGdhZB8kiG48zCV5SvBmixocdusKOFQGcWDmltO8Gadi28GcHx78T1w8o006IVYMz2z',
);
const Product = require('../models/Product');
const catchAsync = require('../utils/catch');
const AppError = require('../utils/error');

exports.createSession = catchAsync(async (req, res, next) => {
  let items = [];
  req.body.items.forEach((item) => {
    items.push({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          description: item.options.join(','),
          images: [item.image],
          metadata: {
            options: item.options.join(','),
          },
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    });
  });
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: items,
    mode: 'payment',
    success_url: `http://localhost:4200/checkout/{CHECKOUT_SESSION_ID}`,
    cancel_url: `http://localhost:4200/shopping-cart`,
  });

  res.status(200).json({
    status: 'success',
    id: session.id,
  });
});

exports.getSession = catchAsync(async (req, res, next) => {
  const session = await stripe.checkout.sessions.retrieve(req.params.id);
  const items = await stripe.checkout.sessions.listLineItems(req.params.id, {
    expand: ['data.price.product'],
  });

  res.status(200).json({
    status: 'success',
    data: {
      customer: session.customer_details,
      items,
    },
  });
});
