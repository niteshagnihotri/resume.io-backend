// middleware/auth.js
import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    console.log("Invalid token: ", err);
    return res.status(403).json({ message: "Invalid token" });
  }
};