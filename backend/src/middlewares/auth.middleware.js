const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { User } = require('../models/user.model.js');

const verifyJWT = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    const user = await User.findById(decodedToken.id)
      .select('name email role')
      .lean();

    if (!user) {
      throw new ApiError(401, "Invalid access token");
    }

    user.id = user._id.toString();
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});

const verifyRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req?.user || !allowedRoles.includes(req.user.role)) {
      throw new ApiError(403, "You don't have permission to access this resource");
    }
    next();
  }
}

module.exports = {
  verifyJWT,
  verifyRole
};
