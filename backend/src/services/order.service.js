const ApiError = require('../utils/ApiError');
const cartService = require('./cart.service');
const { Order } = require('../models/order.model.js');
const { OrderItem } = require('../models/orderItem.model.js');
const { Payment } = require('../models/payment.model.js');
const { User } = require('../models/user.model.js');
const { CartItem } = require('../models/cartItem.model.js');
// const mongoose = require('mongoose');

const createOrder = async (userId, data) => {
  const { addressInfo, paymentMethod, items, initialStatus } = data;

  if (!items || items.length === 0) {
    throw new ApiError(400, "Order items cannot be empty");
  }

  let totalAmount = 0;
  items.forEach(item => {
    totalAmount += (item.price * item.quantity) + ((item.deliveryCharge || 0) * item.quantity);
  });

  // Start Transaction if needed, but for simplicity we rely on sequential ops
  // const session = await mongoose.startSession();
  // session.startTransaction();

  try {
    const newOrder = await Order.create([{
      userId,
      totalAmount,
      paymentMethod,
      status: initialStatus || (paymentMethod === 'ONLINE' ? 'CONFIRMED' : 'PENDING'),
      addressInfo: addressInfo || {}
    }]);

    const orderId = newOrder[0]._id;

    const orderItemsData = items.map(item => ({
      orderId,
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
      deliveryCharge: item.deliveryCharge || 0
    }));

    await OrderItem.insertMany(orderItemsData);

    await Payment.create([{
      orderId,
      amount: totalAmount,
      gateway: paymentMethod === 'ONLINE' ? 'Razorpay' : 'COD',
      status: paymentMethod === 'ONLINE' ? 'SUCCESS' : 'PENDING'
    }]);

    // Also clear the user's DB cart if it existed
    try {
      const cart = await cartService.getCart(userId);
      if (cart) {
        await CartItem.deleteMany({ cartId: cart._id });
      }
    } catch(err) {}

    // await session.commitTransaction();
    // session.endSession();

    // Fetch and return the constructed order
    return getOrderById(userId, orderId);

  } catch (error) {
    // await session.abortTransaction();
    // session.endSession();
    throw error;
  }
};

const getOrderById = async (userId, orderId) => {
  const order = await Order.findById(orderId).lean();

  if (!order) throw new ApiError(404, "Order not found");
  
  const user = await User.findById(userId).lean();
  if (user.role !== 'ADMIN' && order.userId.toString() !== userId.toString()) {
    throw new ApiError(403, "Not authorized to view this order");
  }

  const payment = await Payment.findOne({ orderId }).lean();
  const orderItemsList = await OrderItem.find({ orderId })
    .populate('productId')
    .lean();

  return {
    ...order,
    id: order._id,
    payment,
    orderItems: orderItemsList.map(oi => ({
      ...oi,
      id: oi._id,
      product: {
        ...oi.productId,
        id: oi.productId?._id
      }
    }))
  };
};

const getUserOrders = async (userId) => {
  const ordersRaw = await Order.find({ userId })
    .sort({ createdAt: -1 })
    .lean();

  return Promise.all(ordersRaw.map(async (o) => {
    const payment = await Payment.findOne({ orderId: o._id }).lean();
    const orderItemsList = await OrderItem.find({ orderId: o._id }).lean();
    
    return {
      ...o,
      id: o._id,
      payment,
      orderItems: orderItemsList.map(oi => ({ ...oi, id: oi._id }))
    };
  }));
};

const updateOrderStatus = async (orderId, status) => {
  return Order.findByIdAndUpdate(
    orderId,
    { status },
    { new: true }
  );
};

module.exports = {
  createOrder,
  getOrderById,
  getUserOrders,
  updateOrderStatus
};
