const jwt = require("jsonwebtoken");

module.exports = function authMiddleWare(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No Token Provided" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("DECODED TOKEN:", decoded);

    const userId = decoded.user || decoded.id || decoded._id;

    if (!userId) {
      return res.status(401).json({
        message: "Token does not contain user id",
      });
    }

    // ✅ Store everything under req.user (CLEAN APPROACH)
    req.user = {
      id: userId,
      role: decoded.role,
    };

    console.log("FINAL userId:", req.user.id);

    next();
  } catch (err) {
    console.log("auth middleware error:", err);
    return res.status(401).json({
      message: "Invalid Token or expired token",
      error: err.message,
    });
  }
};
