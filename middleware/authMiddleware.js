const jwt = require("jsonwebtoken");

module.exports = function authMiddleWare(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "No Token Provided" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.jwt_SECRET);

    console.log(decoded, "decoded token");
    req.userId = decoded.user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid Token" });
  }
};
