const bcrypt = require('bcrypt');
console.log('      8b-2-1. Bcrypt imported');
const jwt = require('jsonwebtoken');
console.log('      8b-2-2. Jwt imported');
const ApiError = require('../utils/ApiError');
console.log('      8b-2-3. ApiError imported');
const { User } = require('../models/user.model.js');
console.log('      8b-2-4. User model imported');

const generateAccessAndRefreshTokens = async (userId) => {
  const user = await User.findById(userId);
  
  if (!user) throw new ApiError(404, "User not found");

  const accessToken = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN }
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
  );

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

const registerUser = async (data) => {
  const { name, email, password, phone } = data;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "User with this email already exists");
  }

  const user = await User.create({
    name,
    email,
    password, // Password hashing is handled by pre('save') hook in Mongoose model
    phone,
  });

  const userResponse = {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt
  };

  return userResponse;
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  console.log('📡 Login attempt for:', email);
  
  if (!user) {
    console.log('❌ User not found');
    throw new ApiError(401, "Invalid credentials");
  }

  console.log('📡 User found. Checking password...');
  // console.log('📡 DB Hash:', user.password);
  
  const isPasswordValid = await user.isPasswordCorrect(password);
  console.log('📡 Password valid:', isPasswordValid ? '✅ YES' : '❌ NO');
  
  if (!isPasswordValid) {
    console.log('❌ Password mismatch');
    throw new ApiError(401, "Invalid credentials");
  }

  console.log('✅ Login successful for:', email);
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

  const loggedInUser = {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  };

  return { user: loggedInUser, accessToken, refreshToken };
};

const logoutUser = async (userId) => {
  await User.findByIdAndUpdate(
    userId,
    { $set: { refreshToken: null } }
  );
};

const refreshAccessToken = async (incomingRefreshToken) => {
  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(incomingRefreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decodedToken.id);

    if (!user || user.refreshToken !== incomingRefreshToken) {
      throw new ApiError(401, "Invalid or expired refresh token");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(401, "Invalid or expired refresh token");
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken
};
