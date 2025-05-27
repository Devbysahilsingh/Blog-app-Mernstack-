import Blog from '../models/Blog.js';
import { validationResult } from 'express-validator';
import slugify from 'slugify';

const allowedCategories = ["Strategy", "Marketing and Sales", "Finance", "Mindset", "Communication"];

export const createBlog = async (req, res) => {
  try {
    // Check express-validator errors (if you have middleware for validation)
    const errors = validationResult(req);
    if (!errors.isEmpty()) { 
      return res.status(400).json({ errors: errors.array() });
    }

    // Destructure fields from body
    const { title, description, category, content, thumbnailURL } = req.body;

    // Validate required fields
    if (!title || !description || !category || !content) {
      return res.status(400).json({ error: "Title, description, category, and content are required" });
    }

    // Validate category
    if (!allowedCategories.includes(category)) {
      return res.status(400).json({ error: `Invalid category. Allowed categories: ${allowedCategories.join(", ")}` });
    }

    // Generate slug from title
    const slug = slugify(title, { lower: true, strict: true });

    // Determine thumbnail: either from uploaded file or URL
    let thumbnailPath = null;
    let thumbnailType = null;

    if (req.file) {
      // File uploaded by multer; req.file.filename contains the saved file name
      thumbnailPath = req.file.filename;
      thumbnailType = "file";
    } else if (thumbnailURL && typeof thumbnailURL === "string" && thumbnailURL.trim() !== "") {
      // Thumbnail provided as a URL string
      thumbnailPath = thumbnailURL.trim();
      thumbnailType = "url";
    }

    // If neither file nor URL provided, reject
    if (!thumbnailPath || !thumbnailType) {
      return res.status(400).json({ error: "Thumbnail (file upload or valid URL) is required" });
    }

    // Create and save blog post
    const newBlog = await Blog.create({
      title,
      slug,
      description,
      category,
      content,
      thumbnail: thumbnailPath,
      thumbnailType,
    });

    return res.status(201).json({ message: "Blog created successfully", blog: newBlog });
  } catch (err) {
    console.error("Error creating blog:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
