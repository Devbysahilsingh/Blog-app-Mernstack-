import jwt from "jsonwebtoken";
import User from "../models/User.js"; // Adjust path to your User model

// Middleware to protect routes - verifies JWT and attaches user to req
export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing authorization token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Sequelize method to find user by primary key (id)
    req.user = await User.findByPk(decoded.id, {
      attributes: { exclude: ["password"] }, // exclude password from user data
    });

    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    next();
  } catch (err) {
    console.error("Authentication error:", err.message);
    res.status(401).json({ message: "Invalid token" });
  }
};

// Middleware to check if the user is admin
export const isAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};
