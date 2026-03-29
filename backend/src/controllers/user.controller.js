const asyncHandler = require('../utils/asyncHandler');
const userService = require('../services/user.service');
const ApiResponse = require('../utils/ApiResponse');

const getProfile = asyncHandler(async (req, res) => {
  const user = await userService.getUserProfile(req.user.id);
  res.status(200).json(new ApiResponse(200, user, "User profile fetched successfully"));
});

const updateProfile = asyncHandler(async (req, res) => {
  const user = await userService.updateUserProfile(req.user.id, req.body);
  res.status(200).json(new ApiResponse(200, user, "User profile updated successfully"));
});

const addAddress = asyncHandler(async (req, res) => {
  const address = await userService.addAddress(req.user.id, req.body);
  res.status(201).json(new ApiResponse(201, address, "Address added successfully"));
});

const removeAddress = asyncHandler(async (req, res) => {
  await userService.deleteAddress(req.user.id, req.params.addressId);
  res.status(200).json(new ApiResponse(200, {}, "Address deleted successfully"));
});

module.exports = {
  getProfile,
  updateProfile,
  addAddress,
  removeAddress
};
