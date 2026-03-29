const ApiError = require('../utils/ApiError'); // trigger nodemon
const { uploadOnCloudinary } = require('../utils/cloudinaryUploader');
const { Category } = require('../models/category.model.js');
const { Product } = require('../models/product.model.js');

// CATEGORY SERVICES (Fallback if this file is hit instead of category.service.js)
const createCategory = async (data) => {
  const { name, slug } = data;
  const existing = await Category.findOne({ slug });
  if (existing) throw new ApiError(400, "Category slug already exists");

  return Category.create({ name, slug });
};

const getCategories = async () => {
  return Category.find().lean();
};

const deleteCategory = async (id) => {
  return Category.findByIdAndDelete(id);
};

const updateCategory = async (id, data) => {
  return Category.findByIdAndUpdate(id, data, { new: true });
};

// PRODUCT SERVICES
const createProduct = async (data, files) => {
  const { name, slug, description, price, deliveryCharge, stock, categoryId, subcategoryId, colors, sizes } = data;
  
  const productSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  
  const existing = await Product.findOne({ slug: productSlug });
  if (existing) throw new ApiError(400, "Product slug already exists");

  const imageUrls = [];
  if (files && files.length > 0) {
    for (const file of files) {
      const uploadResult = await uploadOnCloudinary(file.path);
      if (uploadResult) imageUrls.push(uploadResult.secure_url);
    }
  }

  return Product.create({
    name,
    slug: productSlug,
    description,
    price: parseFloat(price),
    deliveryCharge: deliveryCharge ? parseFloat(deliveryCharge) : 0,
    stock: parseInt(stock),
    categoryId,
    subcategoryId: subcategoryId || null,
    images: imageUrls,
    colors: colors ? JSON.parse(colors) : [], 
    sizes: sizes ? JSON.parse(sizes) : []
  });
};

const getProducts = async (filters) => {
  const { page = 1, limit = 10, categoryId, search } = filters;
  const skip = (page - 1) * limit;

  const where = {};
  if (categoryId) where.categoryId = categoryId;
  if (search) {
    where.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  const [productsRaw, total] = await Promise.all([
    Product.find(where)
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .populate('categoryId')
      .populate('subcategoryId')
      .sort({ createdAt: -1 })
      .lean(),
    Product.countDocuments(where)
  ]);

  const products = productsRaw.map(p => ({
    ...p,
    id: p._id,
    category: p.categoryId,
    subcategory: p.subcategoryId
  }));

  return { products, total, totalPages: Math.ceil(total / limit), currentPage: parseInt(page) };
};

const getProductById = async (id) => {
  const product = await Product.findById(id)
    .populate('categoryId')
    .populate('subcategoryId')
    .lean();

  if (!product) throw new ApiError(404, "Product not found");

  return {
    ...product,
    id: product._id,
    category: product.categoryId,
    subcategory: product.subcategoryId
  };
};

const updateProduct = async (id, data, files) => {
  let updateData = { ...data };
  
  if (updateData.name && !updateData.slug) {
    updateData.slug = updateData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  if (updateData.price) updateData.price = parseFloat(updateData.price);
  if (updateData.deliveryCharge) updateData.deliveryCharge = parseFloat(updateData.deliveryCharge);
  if (updateData.stock) updateData.stock = parseInt(updateData.stock);
  if (updateData.colors && typeof updateData.colors === 'string') updateData.colors = JSON.parse(updateData.colors);
  if (updateData.sizes && typeof updateData.sizes === 'string') updateData.sizes = JSON.parse(updateData.sizes);
  if (!updateData.subcategoryId || updateData.subcategoryId === '' || updateData.subcategoryId === 'null') {
    updateData.subcategoryId = null;
  }

  if (files && files.length > 0) {
    const imageUrls = [];
    for (const file of files) {
      const uploadResult = await uploadOnCloudinary(file.path);
      if (uploadResult) imageUrls.push(uploadResult.secure_url);
    }
    
    // Only overwrite the existing images if at least one upload was successful.
    if (imageUrls.length > 0) {
      updateData.images = imageUrls;
    }
  }

  return Product.findByIdAndUpdate(
    id,
    updateData,
    { new: true }
  );
};

const deleteProduct = async (id) => {
  return Product.findByIdAndDelete(id);
};

module.exports = {
  createCategory,
  getCategories,
  deleteCategory,
  updateCategory,
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
};
