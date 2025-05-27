import express from "express";
import upload from "./yourMulterConfig.js";

const router = express.Router();

router.post("/api/blogs", (req, res, next) => {
  // Use multer middleware to parse multipart form
  upload.single("thumbnail")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // Handle Multer-specific errors
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ error: "Thumbnail image size should not exceed 10MB." });
      }
      if (err.code === "LIMIT_FIELD_SIZE") {
        return res.status(400).json({ error: "Form data size too large. Please shorten your blog content." });
      }
      if (err.code === "LIMIT_UNEXPECTED_FILE") {
        return res.status(400).json({ error: err.message });
      }
      return res.status(400).json({ error: "File upload error: " + err.message });
    } else if (err) {
      // Other unknown errors
      return res.status(500).json({ error: "Unknown server error during file upload." });
    }

    // Now req.file and req.body are available
    const { title, description, category, content } = req.body;
    // You can also add further validation here for content length if needed

    if (!title || !description || !category || !content) {
      return res.status(400).json({ error: "Missing required blog fields." });
    }

    // Optional: custom length check on content
    if (content.length > 1_000_000) { // ~1 million chars (~1MB)
      return res.status(400).json({ error: "Blog content too long." });
    }

    // Process and save blog post here
    // Save req.file.filename if you want to keep track of uploaded file

    res.status(200).json({ message: "Blog uploaded successfully!" });
  });
});

export default router;
