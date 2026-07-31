/**
 * FloorForge – Request Validation Middleware
 * Verwendet express-validator
 */
const { validationResult } = require('express-validator');

/**
 * Validierungsfehler prüfen und als 422 zurückgeben
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: 'Validation Error',
      details: errors.array().map(e => ({
        field: e.path,
        message: e.msg,
      })),
    });
  }
  return next();
};

module.exports = { validate };
