module.exports = (err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal server error";
  console.error(`[ERROR] ${status} ${req.method} ${req.url}:`, message);
  res.status(status).json({ success: false, message });
};
