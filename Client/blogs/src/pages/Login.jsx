import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthContext } from "../Context/AuthContext";
import loginImage from "../assets/login.png";
import bannerimage from "../assets/banner.png";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed");
        setLoading(false);
        return;
      }

      const { token, email: userEmail, userRole, username } = data;

      if (!token || !userEmail || !userRole || !username) {
        setError("Invalid response from server.");
        setLoading(false);
        return;
      }

      const user = {
        name: username,
        email: userEmail,
        role: userRole,
      };

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
      } else {
        localStorage.removeItem("rememberMe");
      }

      login(user);
      setLoading(false);

      navigate(user.role === "admin" ? "/admin" : "/profile");
    } catch (err) {
      console.error("Login error:", err);
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#F5F5F5] dark:bg-[#1C1C1E] items-center justify-center overflow-hidden">
      {/* Left Side - Images */}
      <aside className="lg:w-1/2 w-full flex flex-col">
        <img
          src={bannerimage}
          alt="Banner"
          className="w-full h-[220px] object-cover hidden md:block lg:hidden rounded-b-xl"
          loading="lazy"
        />
        <img
          src={loginImage}
          alt="Login"
          className="w-full h-screen object-contain hidden lg:block rounded-l-xl"
          loading="lazy"
        />
      </aside>

      {/* Right Side - Form */}
      <main className="lg:w-1/2 w-full flex items-center justify-center p-6 sm:p-12">
        <motion.div
          className="w-full max-w-md bg-[#FFF9C4] dark:bg-[#2C2C2E] text-[#0D0D0D] dark:text-white rounded-3xl shadow-lg p-8 sm:p-10 hover:shadow-xl transition-shadow duration-300"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <h2 className="text-3xl font-bold text-center mb-6">Welcome Back</h2>

          {error && (
            <div className="bg-red-100 text-red-800 px-4 py-2 rounded-md mb-4 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block mb-2 font-medium">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-[#1C1C1E] focus:outline-none focus:ring-2 focus:ring-[#FFD600] transition"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block mb-2 font-medium">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-[#1C1C1E] focus:outline-none focus:ring-2 focus:ring-[#FFD600] transition"
                placeholder="Enter your password"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="mr-2"
              />
              <label htmlFor="rememberMe">Remember me</label>
            </div>

            <motion.button
              type="submit"
              className="w-full bg-[#FFD600] hover:bg-[#FDD835] dark:hover:bg-[#FFD600] text-[#0D0D0D] font-semibold py-3 rounded-lg transition duration-300 focus:outline-none focus:ring-4 focus:ring-[#FFD600] flex items-center justify-center gap-3"
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.03 }}
              disabled={loading}
            >
              {loading ? (
                <span className="animate-pulse">Logging in...</span>
              ) : (
                "Login"
              )}
            </motion.button>
          </form>

          <p className="mt-6 text-sm text-center">
            Don’t have an account?{' '}
            <Link
              to="/signup"
              className="dark:text-blue-500 text-blue-700 hover:underline font-medium"
            >
              Sign Up
            </Link>
          </p>
        </motion.div>
      </main>
    </div>
  );
};

export default Login;
