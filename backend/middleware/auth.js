import jwt from "jsonwebtoken";

export default function (req, res, next) {
  const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer "))
      return res.status(401).json({ msg: "No token, authorization denied" });
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "No token, authorization denied" });
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded.id;
      next();
    } catch (err) {
      return res.status(401).json({ msg: err.message || "Token is not valid" });
    }
}
