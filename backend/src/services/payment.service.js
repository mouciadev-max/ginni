const Razorpay = require('razorpay');
const crypto = require('crypto');
const ApiError = require('../utils/ApiError');

const getRazorpayInstance = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || keyId === 'rzp_test_your_key_id_here' || !keySecret || keySecret === 'your_razorpay_key_secret_here') {
    throw new ApiError(500, 'Razorpay is not configured. Please replace the placeholder values in your .env file with real RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.');
  }

  return new Razorpay({ key_id: keyId, key_secret: keySecret });
};

/**
 * Create a Razorpay order (amount must be in paise, so multiply INR by 100)
 */
const createRazorpayOrder = async (amountInRupees) => {
  const razorpay = getRazorpayInstance();
  const options = {
    amount: Math.round(amountInRupees * 100), // convert to paise
    currency: 'INR',
    receipt: `receipt_${Date.now()}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    return order;
  } catch (err) {
    throw new ApiError(500, `Razorpay order creation failed: ${err.message}`);
  }
};

/**
 * Verify Razorpay payment signature to confirm the payment was successful
 */
const verifyRazorpayPayment = (razorpayOrderId, razorpayPaymentId, razorpaySignature) => {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  const body = `${razorpayOrderId}|${razorpayPaymentId}`;
  const expectedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(body)
    .digest('hex');

  return expectedSignature === razorpaySignature;
};

module.exports = { createRazorpayOrder, verifyRazorpayPayment };
