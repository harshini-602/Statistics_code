const { validationResult } = require('express-validator');

// Middleware to handle validation results from express-validator
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array().map(e => ({ param: e.param, msg: e.msg })) });
  }
  next();
};

module.exports = { handleValidation };
