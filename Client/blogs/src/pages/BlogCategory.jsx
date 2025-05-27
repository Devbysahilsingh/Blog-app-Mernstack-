import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BlogCard from "../Components/BlogCard";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import { motion } from "framer-motion";

const BlogCategory = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlogs() {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:5000/api/blogs");
        const allBlogs = await response.json();
        const filtered = allBlogs.filter(
          (blog) => blog.category.toLowerCase() === category.toLowerCase()
        );
        setBlogs(filtered);
      } catch (error) {
        console.error("Failed to fetch blogs", error);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    }
    fetchBlogs();
  }, [category]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] bg-[#F5F5F5] dark:bg-[#0D0D0D]">
        <motion.div
          className="rounded-full h-12 w-12 border-t-4 border-[#FFD600] border-opacity-75 animate-spin"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        />
      </div>
    );
  }

  if (!blogs.length) {
    return (
      <motion.div
        className="text-center py-20 px-4 min-h-screen bg-[#F5F5F5] dark:bg-[#0D0D0D]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-[#2C2C2E] dark:text-[#FFF9C4]">
          No blogs found in
          <span className="ml-2 capitalize text-[#FFD600]">{category}</span>
        </h2>
        <p className="text-[#1C1C1E] dark:text-[#F5F5F5] mb-6">
          Try exploring other categories or return to the main blog page.
        </p>
        <button
          onClick={() => navigate("/blog")}
          className="inline-block px-6 py-2 bg-[#FFD600] text-black font-semibold rounded-lg hover:bg-[#FDD835] transition"
        >
          Back to All Blogs
        </button>
      </motion.div>
    );
  }

  return (
    <div className="bg-[#F5F5F5] dark:bg-[#0D0D0D] min-h-screen transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <motion.h1
          className="text-3xl sm:text-4xl font-bold mb-10 text-center text-[#1C1C1E] dark:text-[#FFF9C4]"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="capitalize text-[#FFD600]">{category}</span> Blogs
        </motion.h1>

        <Swiper
          modules={[Pagination]}
          spaceBetween={20}
          pagination={{ clickable: true }}
          breakpoints={{
            0: { slidesPerView: 1 },
            640: { slidesPerView: 1.2 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {blogs.map((blog) => (
            <SwiperSlide key={blog._id}>
              <motion.div
                className="h-full"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <BlogCard
                  blog={blog}
                  isSaved={false}
                  onSaveToggle={() => {}}
                />
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default BlogCategory;
