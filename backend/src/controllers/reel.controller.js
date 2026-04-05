const asyncHandler = require('../utils/asyncHandler');
const reelService = require('../services/reel.service');
const ApiResponse = require('../utils/ApiResponse');

const getReels = asyncHandler(async (req, res) => {
  const reels = await reelService.getReels();
  res.status(200).json(new ApiResponse(200, reels, "Reels fetched successfully"));
});

const createReel = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const reel = await reelService.createReel(productId, req.file);
  res.status(201).json(new ApiResponse(201, reel, "Reel created successfully"));
});

const deleteReel = asyncHandler(async (req, res) => {
  await reelService.deleteReel(req.params.id);
  res.status(200).json(new ApiResponse(200, null, "Reel deleted successfully"));
});

module.exports = {
  getReels,
  createReel,
  deleteReel
};
