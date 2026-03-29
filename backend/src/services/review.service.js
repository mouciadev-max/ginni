const { Review } = require('../models/review.model');
const { Order } = require('../models/order.model');
const ApiError = require('../utils/ApiError');

const submitReview = async (userId, orderId, data) => {
  // Verify the order belongs to this user and is DELIVERED
  const order = await Order.findById(orderId);
  if (!order) throw new ApiError(404, 'Order not found');
  if (order.userId.toString() !== userId.toString()) throw new ApiError(403, 'Not authorized');
  if (order.status !== 'DELIVERED') throw new ApiError(400, 'You can only review delivered orders');

  // Check if already reviewed
  const existing = await Review.findOne({ userId, orderId });
  if (existing) throw new ApiError(400, 'You have already submitted feedback for this order');

  return Review.create({ userId, orderId, rating: data.rating, comment: data.comment });
};

const getReviewByOrder = async (userId, orderId) => {
  return Review.findOne({ userId, orderId }).lean();
};

module.exports = { submitReview, getReviewByOrder };
