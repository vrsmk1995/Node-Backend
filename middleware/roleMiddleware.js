module.exports = function (roles) {
  return (req, res, next) => {
    console.log("adminsOnly middleware HIT");
    console.log("req.user:", req.user);
    console.log("req.userRole:", req.userRole);

    if (!req.user || !roles.includes(req.user.role)) {
      console.log("Access Denied by adminsOnly");
      return res.status(403).json({
        message: "Access Denied",
      });
    }

    console.log("Admin check PASSED");
    next();
  };
};
