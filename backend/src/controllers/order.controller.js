const asyncHandler = require('../utils/asyncHandler');
const orderService = require('../services/order.service');
const paymentService = require('../services/payment.service');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');

const createOrder = asyncHandler(async (req, res) => {
  const order = await orderService.createOrder(req.user.id, req.body);
  res.status(201).json(new ApiResponse(201, order, "Order placed successfully"));
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await orderService.getOrderById(req.user.id, req.params.id);
  res.status(200).json(new ApiResponse(200, order, "Order fetched successfully"));
});

const getUserOrders = asyncHandler(async (req, res) => {
  const orders = await orderService.getUserOrders(req.user.id);
  res.status(200).json(new ApiResponse(200, orders, "Orders fetched"));
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await orderService.updateOrderStatus(req.params.id, status);
  res.status(200).json(new ApiResponse(200, order, "Order status updated"));
});


// Create Razorpay order (returns order_id + amount for frontend popup)
const createRazorpayOrder = asyncHandler(async (req, res) => {
  const { amount } = req.body;
  if (!amount || amount <= 0) throw new ApiError(400, 'Invalid amount');
  const razorpayOrder = await paymentService.createRazorpayOrder(amount);
  res.status(200).json(new ApiResponse(200, {
    order_id: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    key_id: process.env.RAZORPAY_KEY_ID,
  }, 'Razorpay order created'));
});

// Verify payment signature from Razorpay and save order to DB
const verifyRazorpayPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderData } = req.body;

  const isValid = paymentService.verifyRazorpayPayment(razorpay_order_id, razorpay_payment_id, razorpay_signature);
  if (!isValid) throw new ApiError(400, 'Payment verification failed. Invalid signature.');

  // Save the order now that payment is confirmed
  const order = await orderService.createOrder(req.user.id, {
    ...orderData,
    paymentMethod: 'ONLINE',
    razorpayOrderId: razorpay_order_id,
    razorpayPaymentId: razorpay_payment_id,
  });

  res.status(201).json(new ApiResponse(201, order, 'Payment verified and order placed successfully'));
});

module.exports = {
  createOrder,
  getOrderById,
  getUserOrders,
  updateOrderStatus,
  createRazorpayOrder,
  verifyRazorpayPayment,
};
