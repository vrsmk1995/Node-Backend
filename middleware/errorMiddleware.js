module.exports = (err, req, res, next) => {
  console.error("GLOBAL ERROR HANDLER:");
  console.error(err);

  const statusCode = err.statusCode || 500;
  const status = err.status || "error";

  res.status(statusCode).json({
    status,
    message: err.message || "Something went wrong",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
