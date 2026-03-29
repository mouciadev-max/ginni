const ApiError = require('../utils/ApiError');
const { Category } = require('../models/category.model.js');
const { Subcategory } = require('../models/subcategory.model.js');

const getAllCategories = async () => {
  const categories = await Category.find().lean();
  const subcategories = await Subcategory.find().lean();

  // map subcategories to their corresponding categories
  return categories.map(cat => ({
    ...cat,
    id: cat._id,
    subcategories: subcategories
      .filter(sub => sub.categoryId.toString() === cat._id.toString())
      .map(sub => ({ ...sub, id: sub._id }))
  }));
};

const createCategory = async (data) => {
  const { name } = data;
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  const existing = await Category.findOne({ slug });
  if (existing) {
    throw new ApiError(400, "Category already exists");
  }

  return await Category.create({ name, slug });
};

const createSubcategory = async (categoryId, data) => {
  const { name } = data;
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  const existingCategory = await Category.findById(categoryId);
  if (!existingCategory) {
    throw new ApiError(404, "Category not found");
  }

  const existingSub = await Subcategory.findOne({ slug });
  if (existingSub) {
    throw new ApiError(400, "Subcategory already exists");
  }

  return await Subcategory.create({ name, slug, categoryId });
};

const deleteCategory = async (categoryId) => {
  const category = await Category.findByIdAndDelete(categoryId);
  if (!category) throw new ApiError(404, "Category not found");
  
  // Cascade delete subcategories
  await Subcategory.deleteMany({ categoryId });
  
  return category;
};

const deleteSubcategory = async (subcategoryId) => {
  const subcategory = await Subcategory.findByIdAndDelete(subcategoryId);
  if (!subcategory) throw new ApiError(404, "Subcategory not found");
  return subcategory;
};

module.exports = {
  getAllCategories,
  createCategory,
  createSubcategory,
  deleteCategory,
  deleteSubcategory
};
