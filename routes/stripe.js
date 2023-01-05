const router = require('express').Router();
const express = require('express')
const stripe = require('stripe')(process.env.STRIPE_KEY);

const Order = require("../models/Order");

// Calculate the the order total on the server side to prevent 
// bad intended manipulations on client side (as suggested by Stripe documentation)
const calculateOrderAmount = (items) => {
    return items.reduce((acc, cur) => acc+cur);
  };

router.post('/create-payment-intent', async (req, res) => {
  const { items } = req.body;

  try {
      // Create a PaymentIntent with the order amount and currency
      const paymentIntent = await stripe.paymentIntents.create({
      amount: calculateOrderAmount(items),
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.status(200).send({clientSecret: paymentIntent.client_secret})
  } catch (error) {
    res.status(500).send(error)
  }
  

});

router.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  let event = req.body;

  switch (event.type) {
    case 'payment_intent.succeeded':
      console.log(event.data.object.client_secret)
      try {
        const updatedOrder = await Order.findOneAndUpdate(
          {stripe_client_secret: event.data.object.client_secret},
          {status: 'confirmed'}
        );
      } catch (error) {
        res.status(500).send()
      }
      break;
    default:
      // Unexpected event type
      console.log(`Unhandled event type ${event.type}.`);
  }

  return res.status(200).send()
});

module.exports = router;