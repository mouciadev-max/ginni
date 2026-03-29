const asyncHandler = require('../utils/asyncHandler');
console.log('    8b-1. AsyncHandler imported');
const authService = require('../services/auth.service');
console.log('    8b-2. AuthService imported');
const ApiResponse = require('../utils/ApiResponse');
console.log('    8b-3. ApiResponse imported');

const register = asyncHandler(async (req, res) => {
  const user = await authService.registerUser(req.body);
  res.status(201).json(new ApiResponse(201, user, "User registered successfully"));
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { user, accessToken, refreshToken } = await authService.loginUser(email, password);

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict"
  };

  res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, { user, accessToken, refreshToken }, "User logged in successfully"));
});

const refresh = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
  
  const { accessToken, refreshToken } = await authService.refreshAccessToken(incomingRefreshToken);

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict"
  };

  res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, { accessToken, refreshToken }, "Access token refreshed"));
});

const logout = asyncHandler(async (req, res) => {
  await authService.logoutUser(req.user.id);
  
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict"
  };

  res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

module.exports = {
  register,
  login,
  refresh,
  logout
};
