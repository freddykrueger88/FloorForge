/**
 * FloorForge – Einheitliche API Response Helfer
 */

const success = (res, data, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    data,
  });
};

const created = (res, data) => success(res, data, 201);

const paginated = (res, data, pagination) => {
  return res.status(200).json({
    success: true,
    data,
    pagination,
  });
};

const error = (res, message, statusCode = 400, details = null) => {
  return res.status(statusCode).json({
    success: false,
    error: message,
    ...(details && { details }),
  });
};

module.exports = { success, created, paginated, error };
