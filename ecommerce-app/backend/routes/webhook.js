const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');
const Product = require('../models/Product');
const sendEmail = require('../utils/sendEmail');

router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.log('Webhook signature verification failed.', err.message);
    return res.sendStatus(400);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const orderId = session.metadata.orderId;

    const order = await Order.findById(orderId).populate('items.product').populate('user');
    for (const item of order.items) {
      const product = await Product.findById(item.product._id);
      product.inventory = Math.max(product.inventory - item.quantity, 0);
      await product.save();
    }

    await sendEmail({
      to: order.user.email,
      subject: 'Order Confirmation',
      html: `<h2>Hi ${order.user.name},</h2>
             <p>Thanks for your order!</p>
             <p><strong>Order ID:</strong> ${order._id}</p>
             <p><strong>Total:</strong> $${order.total}</p>
             <p>We'll notify you when your order ships.</p>
             <br><img src="https://yourdomain.com/logo.png" alt="Logo" width="120"/>`
    });
  }

  res.status(200).json({ received: true });
});

module.exports = router;
