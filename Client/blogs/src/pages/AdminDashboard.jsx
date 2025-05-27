import React, { useRef, useState, useCallback, useEffect } from "react";
import JoditEditor from "jodit-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";

const allowedCategories = [
  "Strategy",
  "Marketing and Sales",
  "Finance",
  "Mindset",
  "Communication",
];

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  category: z
    .string()
    .min(1, "Category is required")
    .refine((val) => allowedCategories.includes(val), {
      message: `Category must be one of: ${allowedCategories.join(", ")}`,
    }),
  content: z.string().min(1, "Content is required"),
});

const formItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// Debounce helper function
function debounce(func, wait) {
  let timeout;
  return (...args) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

const AdminDashboard = () => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      content: "",
    },
  });

  const editor = useRef(null);
  const [submitting, setSubmitting] = useState(false);
  const [fileInput, setFileInput] = useState(null);

  const content = watch("content");

  // Debounced function to update content value in form
  const debouncedSetContent = useCallback(
    debounce((value) => {
      setValue("content", value, { shouldValidate: true });
    }, 500),
    [setValue]
  );

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSetContent.cancel && debouncedSetContent.cancel();
    };
  }, [debouncedSetContent]);

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      if (!fileInput) {
        alert("Please select a thumbnail image.");
        setSubmitting(false);
        return;
      }

      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("category", data.category);
      formData.append("content", data.content);
      formData.append("thumbnail", fileInput);

      const response = await fetch("http://localhost:5000/api/blogs", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        alert("Blog submitted successfully!");
        reset(); // Reset form fields
        setFileInput(null); // Clear file input state
      } else {
        alert("Error submitting blog: " + (result.error || JSON.stringify(result)));
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Failed to submit blog");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      className="rounded-4xl max-w-6xl mx-auto p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ backgroundColor: "#F5F5F5", color: "#0D0D0D" }}
    >
      <motion.h1
        className="text-4xl font-bold mb-10 text-center"
        style={{
          background: "linear-gradient(to right, #FFD600, #FDD835)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "black",
        }}
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        Create a New Blog Post
      </motion.h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-8"
        encType="multipart/form-data"
      >
        {/* Title & Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            variants={formItemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1 }}
          >
            <label className="block font-semibold text-lg mb-2">Title</label>
            <input
              type="text"
              {...register("title")}
              className="w-full border-2 px-5 py-3 rounded-lg transition-all duration-300"
              style={{
                borderColor: "#2C2C2E",
                backgroundColor: "#FFF9C4",
                color: "#0D0D0D",
              }}
              placeholder="Enter blog title"
            />
            <AnimatePresence>
              {errors.title && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-red-500 text-sm mt-2"
                >
                  {errors.title.message}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div
            variants={formItemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            <label className="block font-semibold text-lg mb-2">Category</label>
            <select
              {...register("category")}
              className="w-full border-2 px-5 py-3 rounded-lg transition-all duration-300 appearance-none"
              style={{
                borderColor: "#2C2C2E",
                backgroundColor: "#FFF9C4",
                color: "#0D0D0D",
              }}
            >
              <option value="">Select category</option>
              {allowedCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <AnimatePresence>
              {errors.category && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-red-500 text-sm mt-2"
                >
                  {errors.category.message}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Description */}
        <motion.div
          variants={formItemVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3 }}
        >
          <label className="block font-semibold text-lg mb-2">Description</label>
          <textarea
            {...register("description")}
            className="w-full border-2 rounded-lg px-5 py-3 transition-all duration-300 h-32"
            style={{
              borderColor: "#2C2C2E",
              backgroundColor: "#FFF9C4",
              color: "#0D0D0D",
            }}
            placeholder="Enter a short description"
          />
          <AnimatePresence>
            {errors.description && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-red-500 text-sm mt-2"
              >
                {errors.description.message}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Thumbnail Upload */}
        <motion.div
          variants={formItemVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4 }}
        >
          <label className="block font-semibold text-lg mb-2">Thumbnail Image</label>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer"
            style={{ borderColor: "#FFD600", backgroundColor: "#FFF9C4" }}
          >
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFileInput(e.target.files[0])}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <p className="text-gray-700">Drag & drop or click to upload thumbnail</p>
            {fileInput && (
              <motion.p
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="text-sm text-green-600 mt-2"
              >
                {fileInput.name} selected
              </motion.p>
            )}
          </motion.div>
        </motion.div>

        {/* JoditEditor */}
        <motion.div
          variants={formItemVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.5 }}
        >
          <label className="block font-semibold text-lg mb-2">Content</label>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="border-2 rounded-lg overflow-hidden"
            style={{ borderColor: "#2C2C2E" }}
          >
            <JoditEditor
              ref={editor}
              value={content}
              onChange={(newContent) => {
                debouncedSetContent(newContent);
              }}
              config={{
        readonly: false,
        toolbarButtonSize: "medium",
        uploader: { insertImageAsBase64URI: true },
        askBeforePasteHTML: false,
        askBeforePasteFromWord: false,
        pastePlain: false,
        cleanHTML: {
          cleanOnPaste: true,
          fillEmptyParagraph: false,
        },
        saveSelectionOnBlur: true,
        autofocus: true,
        spellcheck: true,
        height: 400,
        toolbarSticky: false,
      }}
      tabIndex={1}
/>
          </motion.div>
          <AnimatePresence>
            {errors.content && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-red-500 text-sm mt-2"
              >
                {errors.content.message}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Submit Button */}
        <motion.div
          variants={formItemVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <button
            type="submit"
            disabled={submitting}
            className={`inline-block px-10 py-3 rounded-lg font-bold text-lg transition-colors duration-300 ${
              submitting
                ? "bg-yellow-300 cursor-not-allowed text-gray-600"
                : "bg-yellow-500 hover:bg-yellow-600 text-black"
            }`}
          >
            {submitting ? "Submitting..." : "Submit Blog"}
          </button>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default AdminDashboard;
