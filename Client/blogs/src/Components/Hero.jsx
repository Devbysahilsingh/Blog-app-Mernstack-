import React, { useEffect, useRef, useState } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { useNavigate } from "react-router-dom";
import avatarImage from "../assets/avatar.png";
import logoImage from "../assets/logo.png";
import brandlogo from "../assets/logomain.png";
import { useAuth } from "../Context/AuthContext";

const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const imageAnimation = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1, ease: "easeOut", delay: 0.3 },
  },
};

const HeroSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const controls = useAnimation();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (inView) controls.start("visible");
  }, [inView, controls]);

  const handleExploreClick = (e) => {
    e.preventDefault();
    navigate("/blog");
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (isLoggedIn) {
      alert("⚠️ You are already logged in!");
    } else {
      navigate("/signup");
    }
  };

  return (
    <>
      {/* Top Hero Banner */}
      <motion.div
        className="w-full min-h-screen flex items-center justify-center py-28 px-6 sm:px-12 bg-[#F5F5F5] dark:bg-[#1C1C1E] transition-colors duration-700 relative overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        {/* Background Circles */}
        <motion.div
          className="absolute top-[-150px] left-[-100px] w-[500px] h-[500px]"
          animate={{ scale: [0.8, 1.1, 0.9], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-[-150px] right-[-100px] w-[600px] h-[600px]"
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 8, repeat: Infinity }}
        />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-24 max-w-7xl w-full items-center px-4 sm:px-8">
          {/* Avatar Image */}
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <motion.img
              src={avatarImage}
              alt="Hero"
              className="w-full max-w-lg xl:max-w-xl rounded-xl shadow-lg border-4 border-[#FFD600] dark:border-[#FDD835] hover:scale-105 transition-transform duration-500"
              whileHover={{ scale: 1.05 }}
            />
          </motion.div>

          {/* Text Content */}
         <motion.div
  className="flex flex-col items-center text-center lg:items-start lg:text-left gap-6"
  initial={{ opacity: 0, x: 60 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
>
  <motion.img
    src={brandlogo}
    alt="Logo"
    className="w-28 sm:w-36 md:w-44 h-auto object-contain shadow-xl"
    whileHover={{ scale: 1.05 }}
  />

  <h1 className="leading-tight font-extrabold text-[#0D0D0D] dark:text-white">
    <span className="block text-2xl sm:text-3xl xl:text-4xl">Welcome to</span>
    <span className="block text-5xl sm:text-6xl xl:text-7xl text-[#FFD600]">Deven</span>
  </h1>

  <p className="text-gray-700 dark:text-gray-300 max-w-xl text-lg sm:text-xl xl:text-2xl">
    Empowering minds through stories. Dive into curated blogs that inform, inspire, and ignite curiosity — tailored by category, delivered with heart.
  </p>

  <button
    onClick={handleExploreClick}
    className="mt-2 sm:mt-4 px-8 py-3 bg-[#FFD600] text-black font-medium rounded-lg hover:bg-[#FDD835] transition-colors duration-300 text-base xl:text-lg"
  >
    Explore Blogs
  </button>
</motion.div>

        </div>
      </motion.div>

      {/* Second Section */}
      <section className="w-full px-6 sm:px-12 lg:px-24 py-20 sm:py-28 bg-[#F5F5F5] dark:bg-[#1C1C1E] transition-colors duration-700">
        <div
          ref={ref}
          className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-24"
        >
          {/* Left Content */}
          <motion.div
            className="w-full md:w-6/12 text-center md:text-left"
            variants={fadeInUp}
            initial="hidden"
            animate={controls}
          >
            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-extrabold mb-6 leading-tight text-[#1C1C1E] dark:text-[#FFF9C4]">
              Startup tips made easy <br />
              <span className="text-[#FFD600] dark:text-[#FDD835]">Made Simple</span>
            </h1>

            <p className="text-[#2C2C2E] dark:text-[#DDD6A6] text-lg sm:text-xl xl:text-2xl mb-10 max-w-lg mx-auto md:mx-0">
              At Kapil Gattani, we break down the complexities of entrepreneurship into simple, digestible steps,
              so no aspiring startup founder ever gets stuck between a brilliant idea and an empty wallet.
              Let’s make every blog count.
            </p>

            <form
              onSubmit={handleSubscribe}
              className="flex flex-col sm:flex-row gap-4 sm:items-center max-w-md mx-auto md:mx-0"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="px-5 py-3 rounded-lg border border-[#2C2C2E] dark:border-[#444444] bg-[#FFF9C4] dark:bg-[#2C2C2E] text-[#1C1C1E] dark:text-[#FFF9C4] focus:outline-none focus:ring-4 focus:ring-[#FFD600] dark:focus:ring-[#FDD835] transition text-base"
                required
              />

              <button
                type="submit"
                disabled={isLoggedIn}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ease-in-out shadow-md w-full sm:w-auto text-base
                  ${isLoggedIn
                    ? "bg-gray-400 cursor-not-allowed text-gray-800"
                    : "bg-[#FFD600] text-[#0D0D0D] hover:bg-[#0D0D0D] hover:text-[#FFD600]"
                  } 
                  dark:${
                    isLoggedIn
                      ? "bg-gray-500 text-gray-200"
                      : "bg-[#FDD835] text-[#1C1C1E] hover:bg-[#F5F5F5] hover:text-[#0D0D0D]"
                  }`}
              >
                Subscribe
              </button>
            </form>
          </motion.div>

          {/* Right Image */}
          <motion.div
            className="w-full md:w-6/12 flex justify-center relative"
            variants={imageAnimation}
            initial="hidden"
            animate={controls}
          >
            <motion.div
              className="absolute -right-12 -top-12 w-96 h-96 rounded-full z-0 blur-3xl opacity-30 bg-gradient-to-r from-[#FFD600] via-[#FDD835] to-[#FFF9C4]"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.4 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
            />
            <div className="relative z-10 w-[280px] sm:w-[360px] md:w-[420px] overflow-hidden rounded-xl shadow-xl">
              <img
                src={logoImage}
                alt="Brand Logo"
                className="w-full h-full object-contain"
                loading="lazy"
              />
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;
