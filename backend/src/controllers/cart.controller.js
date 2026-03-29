const asyncHandler = require('../utils/asyncHandler');
const cartService = require('../services/cart.service');
const ApiResponse = require('../utils/ApiResponse');

const getCart = asyncHandler(async (req, res) => {
  const cart = await cartService.getCart(req.user.id);
  res.status(200).json(new ApiResponse(200, cart, "Cart fetched successfully"));
});

const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const cart = await cartService.addToCart(req.user.id, productId, quantity);
  res.status(200).json(new ApiResponse(200, cart, "Item added to cart"));
});

const updateCartItem = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const cart = await cartService.updateCartItem(req.user.id, productId, quantity);
  res.status(200).json(new ApiResponse(200, cart, "Cart updated"));
});

const removeFromCart = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const cart = await cartService.removeFromCart(req.user.id, productId);
  res.status(200).json(new ApiResponse(200, cart, "Item removed from cart"));
});

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart
};
