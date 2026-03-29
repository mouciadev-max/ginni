const cloudinary = require('../config/cloudinary');
const fs = require('fs');
const ApiError = require('./ApiError');

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });
        fs.unlinkSync(localFilePath); // remove local saved temp file
        return response;
    } catch (error) {
        if(fs.existsSync(localFilePath)) {
          fs.unlinkSync(localFilePath);
        }
        throw new ApiError(400, "Cloudinary upload failed: " + error.message);
    }
}

module.exports = { uploadOnCloudinary };
