const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "veritas_secret";

module.exports = function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer "))
    return res.status(401).json({ success:false, message:"No token provided" });
  const token = header.split(" ")[1];
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ success:false, message:"Invalid or expired token — please log in again" });
  }
};
