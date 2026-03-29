const asyncHandler = require('../utils/asyncHandler');
const productService = require('../services/product.service');
const ApiResponse = require('../utils/ApiResponse');

// Categories
const createCategory = asyncHandler(async (req, res) => {
  const category = await productService.createCategory(req.body);
  res.status(201).json(new ApiResponse(201, category, "Category created successfully"));
});

const getCategories = asyncHandler(async (req, res) => {
  const categories = await productService.getCategories();
  res.status(200).json(new ApiResponse(200, categories, "Categories fetched successfully"));
});

const deleteCategory = asyncHandler(async (req, res) => {
  await productService.deleteCategory(req.params.id);
  res.status(200).json(new ApiResponse(200, {}, "Category deleted successfully"));
});

// Products
const createProduct = asyncHandler(async (req, res) => {
  const files = req.files; // expecting multiple files
  const product = await productService.createProduct(req.body, files);
  res.status(201).json(new ApiResponse(201, product, "Product created successfully"));
});

const getProducts = asyncHandler(async (req, res) => {
  const filters = {
    page: req.query.page,
    limit: req.query.limit,
    categoryId: req.query.categoryId,
    search: req.query.search
  };
  const result = await productService.getProducts(filters);
  res.status(200).json(new ApiResponse(200, result, "Products fetched successfully"));
});

const getProductById = asyncHandler(async (req, res) => {
  const product = await productService.getProductById(req.params.id);
  res.status(200).json(new ApiResponse(200, product, "Product fetched successfully"));
});

const updateProduct = asyncHandler(async (req, res) => {
  const product = await productService.updateProduct(req.params.id, req.body, req.files);
  res.status(200).json(new ApiResponse(200, product, "Product updated successfully"));
});

const deleteProduct = asyncHandler(async (req, res) => {
  await productService.deleteProduct(req.params.id);
  res.status(200).json(new ApiResponse(200, {}, "Product deleted successfully"));
});

module.exports = {
  createCategory,
  getCategories,
  deleteCategory,
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
};
