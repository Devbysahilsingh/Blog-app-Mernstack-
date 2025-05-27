import Blog from '../models/Blog';  // your path here

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

export const searchBlogs = async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json([]);

  try {
    const safeQ = escapeRegex(q);
    const regex = new RegExp(`^${safeQ}`, "i");

    const results = await Blog.find({ title: regex }).limit(10);

    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
