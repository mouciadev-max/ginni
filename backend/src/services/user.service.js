const ApiError = require('../utils/ApiError');
const { User } = require('../models/user.model.js');
const { Address } = require('../models/address.model.js');

const getUserProfile = async (userId) => {
  const user = await User.findById(userId)
    .select('name email phone avatar role createdAt')
    .lean();

  if (!user) throw new ApiError(404, "User not found");

  const addresses = await Address.find({ userId: userId }).lean();
  user.addresses = addresses;

  return user;
};

const updateUserProfile = async (userId, updateData) => {
  const { name, phone, avatar } = updateData;
  
  const user = await User.findByIdAndUpdate(
    userId,
    { name, phone, avatar },
    { new: true }
  ).select('name email phone avatar role');

  if (!user) throw new ApiError(404, "User not found");
  return user;
};

const addAddress = async (userId, addressData) => {
  const { street, city, state, zip, country, isDefault } = addressData;

  if (isDefault) {
    await Address.updateMany(
      { userId },
      { isDefault: false }
    );
  }

  const newAddress = await Address.create({
    userId,
    street,
    city,
    state,
    zip,
    country,
    isDefault: isDefault || false
  });

  return newAddress;
};

const deleteAddress = async (userId, addressId) => {
  const address = await Address.findOne({ _id: addressId });
  
  if (!address || address.userId.toString() !== userId.toString()) {
    throw new ApiError(404, "Address not found");
  }

  await Address.findByIdAndDelete(addressId);
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  addAddress,
  deleteAddress
};
