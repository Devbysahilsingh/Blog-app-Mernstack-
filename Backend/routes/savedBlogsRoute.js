import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import Blog from "../models/Blog.js";
import User from "../models/User.js";

const router = express.Router();

function joinUrl(base, path) {
  if (!base.endsWith("/")) base += "/";
  if (path.startsWith("/")) path = path.slice(1);
  return base + path;
}

router.get("/", protect, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [
        {
          model: Blog,
          as: "savedBlogs",
          through: { attributes: [] }, // exclude join table data
          order: [["createdAt", "DESC"]],
        },
      ],
    });

    const baseUrl = process.env.BACKEND_URL || "http://localhost:5000";

    const blogsWithThumbnails = user.savedBlogs.map((blog) => {
      let thumbnailUrl = null;
      if (blog.thumbnailType === "file" && blog.thumbnail) {
        thumbnailUrl = joinUrl(baseUrl, blog.thumbnail);
      } else if (blog.thumbnailType === "url" && blog.thumbnail) {
        thumbnailUrl = blog.thumbnail;
      }

      return {
        ...blog.dataValues,
        thumbnailUrl,
      };
    });

    res.json(blogsWithThumbnails);
  } catch (err) {
    console.error("Error fetching saved blogs:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
