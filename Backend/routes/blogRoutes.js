import express from "express";
import upload from "../middleware/upload.js";
import Blog from "../models/Blog.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

const allowedCategories = [
  "Strategy",
  "Marketing and Sales",
  "Finance",
  "Mindset",
  "Communication",
];

// Helper to safely join URLs
function joinUrl(base, path) {
  if (!base.endsWith("/")) base += "/";
  if (path.startsWith("/")) path = path.slice(1);
  return base + path;
}

const baseUrl = process.env.BACKEND_URL || "http://localhost:5000";

// === GET /api/blogs - fetch all blogs ===
router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.findAll({ order: [["createdAt", "DESC"]] });

    const blogsWithThumbnails = blogs.map((blog) => {
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

    res.status(200).json(blogsWithThumbnails);
  } catch (err) {
    console.error("Error fetching blogs:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// === POST /api/blogs - create a blog ===
router.post("/", upload.single("thumbnail"), async (req, res) => {
  try {
    const { title, description, category, content, thumbnail: thumbnailUrlFromBody } = req.body;

    const errors = [];

    // Validate input
    if (!title?.trim()) errors.push("Title is required");
    if (!description?.trim()) errors.push("Description is required");
    if (!category?.trim()) errors.push("Category is required");
    if (!content?.trim()) errors.push("Content is required");

    if (category && !allowedCategories.includes(category.trim())) {
      errors.push(`Invalid category. Allowed: ${allowedCategories.join(", ")}`);
    }

    // Handle thumbnail
    let thumbnail = "";
    let thumbnailType = "";

    if (req.file) {
      thumbnail = `/uploads/${req.file.filename}`;
      thumbnailType = "file";
    } else if (thumbnailUrlFromBody?.trim()) {
      thumbnail = thumbnailUrlFromBody.trim();
      thumbnailType = "url";
    } else {
      errors.push("Thumbnail is required as either file or URL.");
    }

    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: errors.join(", ") });
    }

    // Generate slug from title if possible, fallback to UUID
    const slugFromTitle = title
      ? title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "")
      : null;
    const slug = slugFromTitle || uuidv4();

    // Check if slug already exists, append UUID if needed
    const existingBlog = await Blog.findOne({ where: { slug } });
    const finalSlug = existingBlog ? `${slug}-${uuidv4()}` : slug;

    const blog = await Blog.create({
      title: title.trim(),
      description: description.trim(),
      category: category.trim(),
      content: content.trim(),
      thumbnail,
      thumbnailType,
      slug: finalSlug,
    });

    const blogResponse = {
      ...blog.dataValues,
      thumbnailUrl:
        thumbnailType === "file" && thumbnail
          ? joinUrl(baseUrl, thumbnail)
          : thumbnailType === "url"
          ? thumbnail
          : null,
    };

    res.status(201).json({ success: true, blog: blogResponse });
  } catch (err) {
    console.error("Error creating blog:", err);
    res.status(500).json({ success: false, message: err.message || "Internal server error" });
  }
});

// === GET /api/blogs/:slug - fetch a single blog by slug ===
router.get("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;

    const blog = await Blog.findOne({ where: { slug } });

    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    const blogWithThumbnail = {
      ...blog.dataValues,
      thumbnailUrl:
        blog.thumbnailType === "file" && blog.thumbnail
          ? joinUrl(baseUrl, blog.thumbnail)
          : blog.thumbnailType === "url"
          ? blog.thumbnail
          : null,
    };

    res.status(200).json(blogWithThumbnail);
  } catch (err) {
    console.error("Error fetching blog by slug:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// === DELETE /api/blogs/:slug - delete a blog by slug ===
router.delete("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;

    // Find the blog first
    const blog = await Blog.findOne({ where: { slug } });

    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    // Delete the blog
    await blog.destroy();

    res.status(200).json({ success: true, message: "Blog deleted successfully" });
  } catch (err) {
    console.error("Error deleting blog:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
