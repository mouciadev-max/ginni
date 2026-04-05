const ApiError = require('../utils/ApiError');
const { Reel } = require('../models/reel.model');
const { Product } = require('../models/product.model');
const { uploadOnCloudinary } = require('../utils/cloudinaryUploader');

const getReels = async () => {
  const reels = await Reel.find().populate('productId', 'name slug price images').lean();
  return reels.map(r => ({
    ...r,
    id: r._id,
    productId: r.productId ? { ...r.productId, id: r.productId._id } : null
  }));
};

const createReel = async (productId, file) => {
  if (!productId) throw new ApiError(400, "Product ID is required.");
  if (!file) throw new ApiError(400, "Video file is required.");

  const existingProduct = await Product.findById(productId);
  if (!existingProduct) throw new ApiError(404, "Product not found.");

  const currentReelsCount = await Reel.countDocuments();
  if (currentReelsCount >= 3) {
    throw new ApiError(400, "Maximum of 3 reels allowed. Please delete an existing reel before uploading a new one.");
  }

  const uploadResult = await uploadOnCloudinary(file.path);
  if (!uploadResult) {
    throw new ApiError(500, "Failed to upload video to Cloudinary.");
  }

  return await Reel.create({ videoUrl: uploadResult.secure_url, productId });
};

const deleteReel = async (id) => {
  const reel = await Reel.findByIdAndDelete(id);
  if (!reel) throw new ApiError(404, "Reel not found.");
  return reel;
};

module.exports = {
  getReels,
  createReel,
  deleteReel
};
