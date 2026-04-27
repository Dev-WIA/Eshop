const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');
const Product = require('../models/Product');
const sendEmail = require('../utils/mailUtils');
const asyncHandler = require('express-async-handler');

// @desc    Create Stripe checkout session
// @route   POST /api/payment/create-checkout-session
// @access  Private
const createCheckoutSession = asyncHandler(async (req, res) => {
  const { orderId } = req.body;
  const order = await Order.findById(orderId);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Check if order belongs to user
  if (order.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to pay for this order');
  }

  const line_items = order.orderItems.map((item) => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: item.name,
        images: [item.image],
      },
      unit_amount: item.price * 100, // Stripe uses cents
    },
    quantity: item.qty,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items,
    mode: 'payment',
    success_url: `${process.env.FRONTEND_URL}/order/${order._id}?success=true`,
    cancel_url: `${process.env.FRONTEND_URL}/order/${order._id}?canceled=true`,
    metadata: {
      orderId: order._id.toString(),
    },
  });

  res.json({ id: session.id, url: session.url });
});

// @desc    Stripe Webhook to confirm payment
// @route   POST /api/payment/webhook
// @access  Public
const stripeWebhook = asyncHandler(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const orderId = session.metadata.orderId;

    const order = await Order.findById(orderId);
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: session.payment_intent,
        status: 'succeeded',
        update_time: Date.now().toString(),
        email_address: session.customer_details.email,
      };
      await order.save();

      // Update Stock
      for (const item of order.orderItems) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { countInStock: -item.qty },
        });
      }

      // Send Email
      try {
        await sendEmail({
          email: session.customer_details.email,
          subject: `Payment Confirmation - Order ${order._id}`,
          message: `Your payment of $${order.totalPrice} for order ${order._id} was successful. We are processing your items.`,
        });
      } catch (err) {
        console.error('Email could not be sent');
      }
    }
  }

  res.json({ received: true });
});

module.exports = {
  createCheckoutSession,
  stripeWebhook,
};
