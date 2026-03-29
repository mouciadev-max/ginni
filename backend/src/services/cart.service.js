const ApiError = require('../utils/ApiError');
const { Cart } = require('../models/cart.model.js');
const { CartItem } = require('../models/cartItem.model.js');
const { Product } = require('../models/product.model.js');

const getCart = async (userId) => {
  let cart = await Cart.findOne({ userId }).lean();

  if (!cart) {
    cart = await Cart.create({ userId });
    cart = cart.toObject({ virtuals: true });
    cart.cartItems = [];
    return cart;
  }

  const items = await CartItem.find({ cartId: cart._id })
    .populate('productId')
    .lean();

  cart.cartItems = items.map(item => ({
    ...item,
    id: item._id,
    product: {
      ...item.productId,
      id: item.productId?._id
    }
  }));

  cart.id = cart._id;
  return cart;
};

const addToCart = async (userId, productId, quantity = 1) => {
  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, "Product not found");

  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = await Cart.create({ userId });
  }

  const existingItem = await CartItem.findOne({ cartId: cart._id, productId });

  if (existingItem) {
    existingItem.quantity += quantity;
    await existingItem.save();
  } else {
    await CartItem.create({
      cartId: cart._id,
      productId,
      quantity
    });
  }

  return getCart(userId);
};

const updateCartItem = async (userId, productId, quantity) => {
  const cart = await Cart.findOne({ userId });
  if (!cart) throw new ApiError(404, "Cart not found");

  const item = await CartItem.findOne({ cartId: cart._id, productId });

  if (!item) throw new ApiError(404, "Product not in cart");

  if (quantity <= 0) {
    await CartItem.findByIdAndDelete(item._id);
  } else {
    item.quantity = quantity;
    await item.save();
  }

  return getCart(userId);
};

const removeFromCart = async (userId, productId) => {
  const cart = await Cart.findOne({ userId });
  if (!cart) throw new ApiError(404, "Cart not found");

  await CartItem.deleteMany({
    cartId: cart._id,
    productId
  });

  return getCart(userId);
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart
};
