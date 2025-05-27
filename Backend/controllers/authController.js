// controllers/authController.js

import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const adminEmails = process.env.ADMIN_EMAILS
  ? process.env.ADMIN_EMAILS.split(",").map(email => email.trim().toLowerCase())
  : [];

// SIGNUP
// SIGNUP
export const signupUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Required field check
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if email already exists
    const existingEmail = await User.findOne({ where: { email: normalizedEmail } });
    if (existingEmail) {
      return res.status(409).json({ message: "User already exists. Please log in." });
    }

    // Check if username already exists
    const existingUsername = await User.findOne({ where: { username } });
    if (existingUsername) {
      return res.status(409).json({ message: "Username is already taken. Please choose a different one." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Determine role
    const role = adminEmails.includes(normalizedEmail) ? "admin" : "user";

    // Create new user
    const newUser = await User.create({
      username,
      email: normalizedEmail,
      password: hashedPassword,
      role,
    });

    // Generate JWT
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(201).json({
      message: "Signup successful",
      token,
      email: newUser.email,
      userRole: newUser.role,
      username: newUser.username,
    });

  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};


// LOGIN
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({ where: { email: normalizedEmail } });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      message: `${user.role} is logged in`,
      token,
      email: user.email,
      userRole: user.role,
      username: user.username,
    });

  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};