const ApiError = require('../utils/ApiError');
const { Category } = require('../models/category.model.js');
const { Subcategory } = require('../models/subcategory.model.js');
const { uploadOnCloudinary } = require('../utils/cloudinaryUploader');

const STATIC_CATEGORIES = [
  'sarees',
  'lehengas',
  'unstitched-suits-suits',
  'girls-ethnic-wear',
  'wedding-collection',
  'festive-collection'
];

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

const createCategory = async (data, file) => {
  const { name } = data;
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  const existing = await Category.findOne({ slug });
  if (existing) {
    throw new ApiError(400, "Category already exists");
  }

  let imageUrl = null;
  if (file) {
    const uploadResult = await uploadOnCloudinary(file.path);
    if (uploadResult) imageUrl = uploadResult.secure_url;
  }

  return await Category.create({ name, slug, image: imageUrl });
};

const createSubcategory = async (categoryId, data, file) => {
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

  let imageUrl = null;
  if (file) {
    const uploadResult = await uploadOnCloudinary(file.path);
    if (uploadResult) imageUrl = uploadResult.secure_url;
  }

  return await Subcategory.create({ name, slug, categoryId, image: imageUrl });
};

const deleteCategory = async (categoryId) => {
  const targetCategory = await Category.findById(categoryId);
  if (!targetCategory) throw new ApiError(404, "Category not found");
  
  if (STATIC_CATEGORIES.includes(targetCategory.slug)) {
    throw new ApiError(403, "Protected static categories cannot be deleted.");
  }

  const category = await Category.findByIdAndDelete(categoryId);
  
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
