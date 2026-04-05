const asyncHandler = require('../utils/asyncHandler');
const categoryService = require('../services/category.service');
const ApiResponse = require('../utils/ApiResponse');

const getCategories = asyncHandler(async (req, res) => {
  const categories = await categoryService.getAllCategories();
  res.status(200).json(new ApiResponse(200, categories, "Categories fetched successfully"));
});

const addCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.createCategory(req.body, req.file);
  res.status(201).json(new ApiResponse(201, category, "Category created successfully"));
});

const addSubcategory = asyncHandler(async (req, res) => {
  const subcategory = await categoryService.createSubcategory(req.params.categoryId, req.body, req.file);
  res.status(201).json(new ApiResponse(201, subcategory, "Subcategory created successfully"));
});

const deleteCategory = asyncHandler(async (req, res) => {
  // We will pass the check to the service to avoid extra DB calls here
  await categoryService.deleteCategory(req.params.id);
  res.status(200).json(new ApiResponse(200, null, "Category deleted successfully"));
});

const deleteSubcategory = asyncHandler(async (req, res) => {
  await categoryService.deleteSubcategory(req.params.id);
  res.status(200).json(new ApiResponse(200, null, "Subcategory deleted successfully"));
});

module.exports = {
  getCategories,
  addCategory,
  addSubcategory,
  deleteCategory,
  deleteSubcategory
};
