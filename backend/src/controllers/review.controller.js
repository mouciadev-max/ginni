const asyncHandler = require('../utils/asyncHandler');
const reviewService = require('../services/review.service');
const ApiResponse = require('../utils/ApiResponse');

const submitReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const review = await reviewService.submitReview(req.user.id, req.params.orderId, { rating, comment });
  res.status(201).json(new ApiResponse(201, review, 'Thank you for your feedback!'));
});

const getReviewByOrder = asyncHandler(async (req, res) => {
  const review = await reviewService.getReviewByOrder(req.user.id, req.params.orderId);
  res.status(200).json(new ApiResponse(200, review || null, 'Review fetched'));
});

module.exports = { submitReview, getReviewByOrder };
