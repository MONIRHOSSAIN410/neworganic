import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

export async function protect(req, res, next) {
  try {
    const token = req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.slice(7) : null;
    if (!token) return res.status(401).json({ message: "Authentication required" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id);
    if (!admin) return res.status(401).json({ message: "Invalid session" });
    req.admin = admin;
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
}
