import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import hpp from "hpp";
import multer from "multer";

dotenv.config();

import sequelize from "./config/db.js";
import "./models/Blog.js";
import "./models/User.js"; // Ensure User is imported to enable associations
// import "./models/associations.js"; // Optional: central place for defining model relationships

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// === Logger Middleware ===
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// === Security Middlewares ===
app.use(
  helmet({
    contentSecurityPolicy:
      process.env.NODE_ENV === "production" ? undefined : false,
  })
);
app.use(hpp());

// === Rate Limiter ===
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: "Too many requests from this IP, please try again later",
});
app.use(limiter);

// === CORS Setup ===
const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:3000";
app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

// === Body Parsers ===
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));

// === Static File Serving ===
app.use(
  "/uploads",
  (req, res, next) => {
    res.header("Access-Control-Allow-Origin", corsOrigin);
    next();
  },
  express.static(path.join(__dirname, "../uploads"))
);

// === Database Connection ===
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ MySQL connected successfully.");
    await sequelize.sync({ alter: true });
    console.log("✅ All models synchronized.");
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
    process.exit(1);
  }
};

(async () => {
  await connectDB();

  try {
    // === Import & Mount Routes ===
    const authRoutes = (await import("./routes/authRoutes.js")).default;
    const profileRoutes = (await import("./routes/profileRoutes.js")).default;
    const blogRoutes = (await import("./routes/blogRoutes.js")).default;
    const savedBlogsRoute = (await import("./routes/savedBlogsRoute.js")).default;
    const searchRoutes = (await import("./routes/searchRoutes.js")).default;

    app.use("/api/auth", authRoutes);
    app.use("/api/profile", profileRoutes);
    app.use("/api/blogs", blogRoutes);
    app.use("/api/saved-blogs", savedBlogsRoute);
    app.use("/api/search", searchRoutes);

    console.log("✅ Routes imported and mounted successfully.");
  } catch (err) {
    console.error("❌ Error importing routes:", err);
    process.exit(1);
  }

  // === Health Check ===
  app.get("/api/health", async (req, res) => {
    try {
      await sequelize.authenticate();
      res.status(200).json({ status: "ok", mysql: "connected" });
    } catch (error) {
      console.error("Health check failed:", error);
      res.status(500).json({ status: "error", mysql: "disconnected" });
    }
  });

  // === 404 Handler ===
  app.use((req, res) => {
    console.log(`⚠️ 404 Not Found: ${req.method} ${req.originalUrl}`);
    res.status(404).json({ success: false, error: "Route not found" });
  });

  // === Global Error Handler ===
  app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
      console.error("Multer Error:", err);
      return res.status(400).json({ success: false, error: err.message });
    }
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    console.error(`Error [${statusCode}]:`, err);

    const errorResponse = {
      success: false,
      error: message,
    };

    if (process.env.NODE_ENV === "development") {
      errorResponse.stack = err.stack;
      errorResponse.details = err;
    }

    res.status(statusCode).json(errorResponse);
  });

  // === Start Server ===
  const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });

  // === Graceful Shutdown ===
  process.on("unhandledRejection", (err) => {
    console.error("Unhandled Rejection:", err);
    server.close(() => process.exit(1));
  });

  process.on("SIGTERM", () => {
    console.log("SIGTERM received. Shutting down gracefully");
    server.close(() => process.exit(0));
  });

  process.on("SIGINT", () => {
    console.log("SIGINT received. Shutting down gracefully");
    server.close(() => process.exit(0));
  });
})();
