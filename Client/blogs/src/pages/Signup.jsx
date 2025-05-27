import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { AuthContext } from "../Context/AuthContext";
import loginImage from "../assets/login.png";
import bannerimage from "../assets/banner.png";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    const { username, email, password } = formData;

    if (!username || !email || !password) {
      setError("All fields are required.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:5000/api/auth/signup", {
        username,
        email,
        password,
      });

      const { token, email: resEmail, userRole, username: resUsername } = response.data;

      const user = {
        email: resEmail,
        role: userRole,
        name: resUsername,
      };

      if (!user || !token) {
        setError("Invalid user data received from server.");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", token);
      login(user);

      setMessage("Signup successful! You are now logged in.");
      setFormData({ username: "", email: "", password: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#F5F5F5] dark:bg-[#1C1C1E] overflow-hidden items-center justify-center">
      {/* Left side - Image/banner */}
      <div className="lg:w-1/2 w-full">
        <img
          src={bannerimage}
          alt="Banner"
          className="w-full h-[220px] object-cover block md:hidden"
        />
        <img
          src={loginImage}
          alt="Login"
          className="w-full h-screen object-contain hidden md:block"
        />
      </div>

      {/* Right side - Signup form */}
      <div className="lg:w-1/2 w-full flex items-center justify-center p-8 sm:p-12 bg-white dark:bg-[#1C1C1E] min-h-screen">
        <motion.div
          className="w-full max-w-md bg-[#FFF9C4] dark:bg-[#2C2C2E] text-[#0D0D0D] dark:text-white rounded-3xl shadow-lg p-8 sm:p-10 hover:shadow-xl transition-shadow duration-300"
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <motion.h2
            className="text-3xl font-extrabold mb-8 text-center text-black dark:text-white"
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            Sign Up
          </motion.h2>

          {message && (
            <div className="bg-green-100 text-green-700 p-3 mb-6 rounded-md text-center font-medium">
              {message}
            </div>
          )}
          {error && (
            <div className="bg-red-100 text-red-700 p-3 mb-6 rounded-md text-center font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label htmlFor="username" className="block mb-2 font-semibold text-black dark:text-[#FFF9C4]">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-md border border-[#FDD835] dark:bg-[#1C1C1E] text-black dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFD600] hover:ring-2 hover:ring-[#FFD600]"
                placeholder="Enter your username"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label htmlFor="email" className="block mb-2 font-semibold text-black dark:text-white">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-md border border-[#FDD835] dark:bg-[#1C1C1E] text-black dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFD600] hover:ring-2 hover:ring-[#FFD600]"
                placeholder="you@example.com"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label htmlFor="password" className="block mb-2 font-semibold text-black">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-md border border-[#FDD835] dark:bg-[#1C1C1E] text-black dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFD600] hover:ring-2 hover:ring-[#FFD600]"
                placeholder="Create a password"
              />
            </motion.div>

            <motion.button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-4 bg-[#FFD600] hover:bg-[#FDD835] rounded-md text-[#0D0D0D] font-semibold transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
            >
              {loading ? "Signing up..." : "Sign Up"}
            </motion.button>
          </form>

          <motion.p
            className="mt-6 text-center text-sm text-[#FFF9C4]dark:text-[#0D0D0D]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            Already have an account? <a href="/login" className="dark:text-blue-500 text-blue-700  hover:underline">Log in</a>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
