const ApiError = require('../utils/ApiError');

const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (err) {
    const errorMessages = err.errors.map(e => e.message);
    next(new ApiError(400, "Validation Error", errorMessages));
  }
};

module.exports = validate;
