const asyncHandler = require('../utils/asyncHandler');
const adminService = require('../services/admin.service');
const ApiResponse = require('../utils/ApiResponse');

const getDashboardStats = asyncHandler(async (req, res) => {
  const stats = await adminService.getDashboardStats();
  res.status(200).json(new ApiResponse(200, stats, "Dashboard stats fetched successfully"));
});

const getAllOrders = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await adminService.getAllOrders(page, limit);
  res.status(200).json(new ApiResponse(200, result, "All orders fetched successfully"));
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await adminService.getAllUsers();
  res.status(200).json(new ApiResponse(200, users, "All users fetched successfully"));
});

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await adminService.deleteUser(id);
  res.status(200).json(new ApiResponse(200, null, "User deleted successfully"));
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const order = await adminService.updateOrderStatus(id, status);
  res.status(200).json(new ApiResponse(200, order, "Order status updated successfully"));
});

module.exports = {
  getDashboardStats,
  getAllOrders,
  getAllUsers,
  deleteUser,
  updateOrderStatus
};
