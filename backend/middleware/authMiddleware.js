import jwt from "jsonwebtoken"; // For verifying JWT tokens

// Middleware to protect routes by checking JWT token
export default function (req, res, next) {
  // Check for authorization header with Bearer token
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  // Extract token from header or cookies
  const token = authHeader.split(" ")[1] || req.cookies?.token;
  if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

  try {
    // Verify token and attach user ID to request
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ msg: err.message || "Token is not valid" });
  }
}
