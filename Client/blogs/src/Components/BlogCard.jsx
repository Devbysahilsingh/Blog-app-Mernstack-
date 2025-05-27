import React, { useCallback, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FaShareAlt,
  FaCheckCircle,
  FaFacebookF,
  FaTwitter,
  FaWhatsapp,
  FaInstagram,
} from "react-icons/fa";

const normalizeUrl = (url) => {
  if (!url) return "";
  return url.startsWith("/uploads")
    ? `http://localhost:5000${url}`
    : url.replace(/([^:]\/)\/+/g, "$1");
};

const cardVariants = {
  rest: {
    scale: 1,
    y: 0,
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.08)",
    transition: {
      duration: 0.35,
      ease: "easeOut",
    },
  },
  hover: {
    scale: 1.06,
    y: -10,
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
    rotate: 0.5,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 28,
      restDelta: 0.001,
    },
  },
};

const imageVariants = {
  rest: {
    scale: 1,
    rotate: 0,
    y: 0,
    boxShadow: "0 0 0 rgba(0, 0, 0, 0)",
    transition: {
      duration: 0.35,
      ease: "easeOut",
    },
  },
  hover: {
    scale: 1.15,
    rotate: 3,
    y: -12,
    boxShadow: "0 25px 50px rgba(0, 0, 0, 0.25)",
    transition: {
      type: "spring",
      stiffness: 320,
      damping: 30,
      restDelta: 0.001,
    },
  },
};



const modalBackground = {
  hidden: { opacity: 0, backdropFilter: "blur(0px)" },
  visible: {
    opacity: 1,
    backdropFilter: "blur(6px)",
    transition: { duration: 0.3 },
  },
};

const modalContent = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
  },
};

const readIndicatorVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
};

const BlogCard = React.memo(({ blog }) => {
  const navigate = useNavigate();
  const [isRead, setIsRead] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState("");

  const handleError = useCallback((e) => {
    e.currentTarget.src = "/placeholder.jpg";
    e.currentTarget.onerror = null;
  }, []);

  const blogUrl = `${window.location.origin}/blog/detail/${blog.slug}`;

  const handleCardClick = () => {
    if (!isRead) setIsRead(true);
    navigate(`/blog/detail/${blog.slug}`);
  };

  const handleShareClick = (e) => {
    e.stopPropagation();
    setShareModalOpen(true);
    setCopySuccess("");
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(blogUrl);
      setCopySuccess("Link copied to clipboard!");
    } catch {
      setCopySuccess("Failed to copy link");
    }
  };

  useEffect(() => {
    if (!copySuccess) return;
    const timer = setTimeout(() => setCopySuccess(""), 2000);
    return () => clearTimeout(timer);
  }, [copySuccess]);

  useEffect(() => {
    if (!shareModalOpen) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") setShareModalOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [shareModalOpen]);

  const closeModal = () => setShareModalOpen(false);

  const socialPlatforms = [
    {
      icon: FaFacebookF,
      color: "#3b5998", // Facebook blue
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(blogUrl)}`,
      label: "Share on Facebook",
    },
    {
      icon: FaTwitter,
      color: "#1DA1F2", // Twitter blue
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(blogUrl)}&text=${encodeURIComponent(blog.title)}`,
      label: "Share on Twitter",
    },
    {
      icon: FaWhatsapp,
      color: "#25D366", // WhatsApp green
      href: `https://wa.me/?text=${encodeURIComponent(blog.title + " " + blogUrl)}`,
      label: "Share on WhatsApp",
    },
    {
      icon: FaInstagram,
      color: "#E1306C", // Instagram pink
      href: "https://instagram.com",
      label: "Instagram (no direct sharing)",
    },
  ];

  // CSS variables for colors
  const colors = {
    "--bg-light": "#F5F5F5",
    "--bg-dark": "#1C1C1E",
    "--card-bg": "#2C2C2E",
    "--text-dark": "#0D0D0D",
    "--text-light": "#F5F5F5",
    "--accent-yellow": "#FFD600",
    "--accent-yellow-light": "#FDD835",
    "--highlight-yellow": "#FFF9C4",
  };

  return (
    <div style={colors} className="w-full max-w-md mx-auto">
      <motion.article
        layout
        initial="rest"
        whileHover="hover"
        animate="rest"
        variants={cardVariants}
        className="relative rounded-3xl shadow-lg overflow-hidden border cursor-pointer"
        style={{
          backgroundColor: colors["--card-bg"],
          borderColor: isRead ? colors["--accent-yellow-light"] + "80" : "#444",
          borderStyle: "solid",
          borderWidth: "1.5px",
        }}
        tabIndex={0}
        onClick={handleCardClick}
        onKeyDown={(e) => e.key === "Enter" && handleCardClick()}
        aria-label={`Blog post: ${blog.title}`}
      >
        {/* Image */}
        <motion.div
          className="h-56 relative overflow-hidden rounded-t-3xl"
          variants={imageVariants}
        >
          <img
            src={normalizeUrl(blog.thumbnailUrl)}
            alt={blog.title || "Blog thumbnail"}
            loading="lazy"
            crossOrigin="anonymous"
            onError={handleError}
            className="w-full h-full object-cover object-center transition-transform duration-300"
            style={{ userSelect: "none" }}
          />
          {/* Read Indicator */}
          <motion.div
            className="absolute top-4 left-4 w-6 h-6 rounded-full shadow-lg flex items-center justify-center"
            variants={readIndicatorVariants}
            initial="hidden"
            animate={isRead ? "visible" : "hidden"}
            aria-label={isRead ? "Read blog post" : "Unread blog post"}
            title={isRead ? "Read" : "Unread"}
            style={{
              backgroundColor: colors["--accent-yellow"],
              boxShadow: "0 0 10px " + colors["--accent-yellow-light"],
            }}
          >
            <FaCheckCircle className="text-black w-4 h-4" />
          </motion.div>
        </motion.div>

        {/* Content */}
        <div
          className="p-6 flex flex-col space-y-4"
          style={{ color: colors["--text-light"] }}
        >
          <h2
            className="text-2xl font-extrabold line-clamp-2"
            style={{ color: colors["--accent-yellow-light"], userSelect: "text" }}
          >
            {blog.title}
          </h2>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <span
              className="text-sm font-semibold rounded-full px-3 py-1 select-none"
              style={{
                background: `linear-gradient(90deg, ${colors["--highlight-yellow"]}, ${colors["--accent-yellow-light"]})`,
                color: colors["--text-dark"],
              }}
            >
              {blog.category}
            </span>

            <div
              className="text-sm font-medium space-y-0.5  sm:text-right"
              style={{ color: colors["--text-light"], userSelect: "text" }}
            >
              <p>
                Published on{" "}
                {new Date(blog.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
              <p>
                by{" "}
                <span
                  style={{ color: colors["--accent-yellow"] }}
                  className="font-semibold"
                >
                  Kapil Gatani
                </span>
              </p>
            </div>
          </div>

          <p
            className="text-base line-clamp-3 leading-relaxed select-text"
            style={{ color: colors["--text-light"] }}
          >
            {blog.description}
          </p>

          {/* Share Button Always Visible */}
          <button
            onClick={handleShareClick}
            className="self-start inline-flex items-center gap-1 rounded-full font-semibold focus:outline-none focus:ring-2 transition"
            style={{
              backgroundColor: colors["--accent-yellow"],
              color: colors["--text-dark"],
              padding: "0.5rem 0.5rem",
            }}
            aria-haspopup="dialog"
            aria-expanded={shareModalOpen}
            aria-controls="share-modal"
          >
            <FaShareAlt className="w-3.5 h-3" />
            Share
          </button>
          
        </div>
      </motion.article>

      {/* Share Modal */}
      <AnimatePresence>
        {shareModalOpen && (
          <motion.div
            id="share-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="share-modal-title"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={modalBackground}
            className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 sm:px-6 overflow-y-auto"
            style={{
              backgroundColor: "rgba(13, 13, 13, 0.8)",
              backdropFilter: "blur(6px)",
            }}
            onClick={closeModal}
          >
            <motion.div
              variants={modalContent}
              className="relative rounded-xl p-5 sm:p-6 md:p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
              style={{
                background:
                  "linear-gradient(135deg, " +
                  colors["--bg-light"] +
                  ", " +
                  colors["--highlight-yellow"] +
                  ")",
                width: "100%",
                maxWidth: "28rem",
                color: colors["--text-dark"],
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3
                id="share-modal-title"
                className="text-xl font-bold mb-4"
                style={{ color: colors["--text-dark"] }}
              >
                Share "{blog.title}"
              </h3>

              <div className="flex flex-wrap justify-center gap-4 mb-6">
                {socialPlatforms.map(({ icon: Icon, color, href, label }, idx) => (
                  <a
                    key={idx}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="inline-flex items-center justify-center w-12 h-12 rounded-full transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2"
                    style={{
                      backgroundColor: color,
                      color: "#fff",
                    }}
                  >
                    <Icon className="w-6 h-6" />
                  </a>
                ))}
              </div>

              <button
                onClick={handleCopyLink}
                className="w-full rounded-md py-3 text-sm font-semibold bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                aria-label="Copy blog link"
                style={{
                  backgroundColor: colors["--accent-yellow"],
                  color: colors["--text-dark"],
                }}
              >
                Copy Link
              </button>
              {copySuccess && (
                <p
                  className="mt-2 text-center text-sm font-medium"
                  style={{ color: colors["--text-dark"] }}
                >
                  {copySuccess}
                </p>
              )}

              <button
                onClick={closeModal}
                className="absolute top-3 right-3 text-xl font-bold text-gray-700 hover:text-gray-900 focus:outline-none"
                aria-label="Close share modal"
              >
                ×
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

export default BlogCard;
