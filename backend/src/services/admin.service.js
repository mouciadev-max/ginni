const { User } = require('../models/user.model.js');
const { Order } = require('../models/order.model.js');
const { Product } = require('../models/product.model.js');
const { Payment } = require('../models/payment.model.js');
const { OrderItem } = require('../models/orderItem.model.js');

const getDashboardStats = async () => {
  const [totalUsers, totalOrders, productsCount, orders] = await Promise.all([
    User.countDocuments({ role: 'USER' }),
    Order.countDocuments(),
    Product.countDocuments(),
    Order.find().select('totalAmount status').lean()
  ]);

  const revenue = orders
    .filter(o => o.status === 'DELIVERED') 
    .reduce((acc, curr) => acc + curr.totalAmount, 0);

  return {
    totalUsers,
    totalOrders,
    productsCount,
    revenue
  };
};

const getAllOrders = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const [ordersRaw, total] = await Promise.all([
    Order.find()
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .lean(),
    Order.countDocuments()
  ]);

  // For each order, fetch items and payment
  const orders = await Promise.all(ordersRaw.map(async (o) => {
    const payment = await Payment.findOne({ orderId: o._id }).lean();
    const orderItemsList = await OrderItem.find({ orderId: o._id })
      .populate({
        path: 'productId',
        populate: [
          { path: 'categoryId' },
          { path: 'subcategoryId' }
        ]
      })
      .lean();
    
    // transform populated fields to match previous prisma structure
    return {
      ...o,
      id: o._id,
      user: o.userId,
      payment: payment,
      orderItems: orderItemsList.map(oi => ({
        ...oi,
        id: oi._id,
        product: {
          ...oi.productId,
          id: oi.productId?._id,
          category: oi.productId?.categoryId,
          subcategory: oi.productId?.subcategoryId
        }
      }))
    };
  }));

  return { orders, total, totalPages: Math.ceil(total / limit), currentPage: parseInt(page) };
};

const getAllUsers = async () => {
  return User.find()
    .select('name email phone role createdAt')
    .sort({ createdAt: -1 })
    .lean();
};

const deleteUser = async (userId) => {
  return User.findByIdAndDelete(userId);
};

const updateOrderStatus = async (orderId, status) => {
  const data = {};
  if (status) data.status = status;
  
  const updatedOrder = await Order.findByIdAndUpdate(
    orderId,
    data,
    { new: true }
  ).lean();

  const payment = await Payment.findOne({ orderId: updatedOrder._id });

  // If marked delivered, automatically mark payment as SUCCESS if it was pending (e.g., COD)
  if (status === 'DELIVERED' && payment && payment.status === 'PENDING') {
     payment.status = 'SUCCESS';
     await payment.save();
  }
  
  return { ...updatedOrder, payment };
};

module.exports = {
  getDashboardStats,
  getAllOrders,
  getAllUsers,
  deleteUser,
  updateOrderStatus
};
