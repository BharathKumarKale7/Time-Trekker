export function errorHandler(err, req, res, next) {
  console.error(`[ERROR] ${err.name || "UnknownError"}: ${err.message}`);
  res.status(err.statusCode || 500).json({
    status: "error",
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
}
