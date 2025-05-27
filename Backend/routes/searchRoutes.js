import express from 'express';
import { Op } from 'sequelize';
import Blog from '../models/Blog.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const { q } = req.query;

  if (!q || typeof q !== 'string' || q.trim().length === 0) {
    return res.status(400).json({ error: "Query parameter 'q' is required and must be a non-empty string" });
  }

  try {
    const searchTerm = `%${q.trim()}%`;

    const results = await Blog.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.like]: searchTerm } },
          { description: { [Op.like]: searchTerm } },
          { category: { [Op.like]: searchTerm } },
        ]
      },
      order: [['created_at', 'DESC']],
      limit: 10,
    });

    res.json(results);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

export default router;
