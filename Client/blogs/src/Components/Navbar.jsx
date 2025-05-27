import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiMenu, FiSearch } from "react-icons/fi";
import { BsSunFill, BsMoonStarsFill } from "react-icons/bs";
import { AiOutlineClose, AiOutlineDown } from "react-icons/ai";
import { useAuth } from "../Context/AuthContext";
import SearchBar from "./SearchBar";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, userRole, logout } = useAuth();
  const isAdmin = userRole === "admin";

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleDarkMode = () => setDarkMode((prev) => !prev);
  const toggleSearch = () => setIsSearchOpen((prev) => !prev);
  const toggleDropdown = () => setDropdownOpen((prev) => !prev);
  const toggleMobileDropdown = () => setMobileDropdownOpen((prev) => !prev);
  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate("/");
  };

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/aboutus", label: "About Us" },
    {
      label: "Blog",
      submenu: [
        { path: "/blog/finance", label: "Finance" },
        { path: "/blog/mindset", label: "Mindset" },
        { path: "/blog/communication", label: "Communication" },
        { path: "/blog/strategy", label: "Strategies" },
        { path: "/blog/Marketing%20and%20Sales", label: "Marketing & Sales" },
      ],
    },
    ...(isLoggedIn && isAdmin ? [{ path: "/admin", label: "Create Blog" }] : []),
  ];

  // Base navbar bg for light and dark mode
  const navbarStyle = darkMode
    ? "bg-black text-yellow-400 shadow-lg"
    : "bg-yellow-300 text-black shadow-md";

  // Hover background + text color changes for light and dark mode
  // Using tailwind's group-hover for dropdown submenu too
  const linkBaseClasses = `
    relative px-3 py-2 rounded-md font-semibold text-lg cursor-pointer transition-all duration-200
    group
  `;

  // Light mode hover: bg-yellow-300, dark mode hover: bg-yellow-400 + text-black for contrast
  const hoverBgClass = darkMode
    ? "hover:bg-yellow-400 hover:text-black"
    : "hover:bg-black hover:text-yellow-300";

  // Dropdown submenu bg for dark and light mode
  const dropdownBgClass = darkMode ? "bg-gray-800" : "bg-white";

  return (
    <>
      <nav className={`fixed w-full z-50 px-6 py-2 ${navbarStyle}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="font-extrabold text-2xl select-none"
          >
            <span className="text-black dark:text-yellow-300">Deven</span>
            <div className="text-xs font-light -mt-1">by kapil gatani</div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((nav, idx) =>
              nav.submenu ? (
                <div key={idx} className="relative group">
                  <button
                    onClick={toggleDropdown}
                    className={`${linkBaseClasses} ${hoverBgClass} flex items-center gap-1 select-none`}
                    aria-haspopup="true"
                    aria-expanded={dropdownOpen}
                  >
                    {nav.label}
                    <AiOutlineDown
                      className={`transition-transform duration-300 ${
                        dropdownOpen ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`absolute top-11 left-0 rounded-md shadow-xl p-2 min-w-[160px] ${dropdownBgClass} z-20`}
                      >
                        {nav.submenu.map((sub, subIdx) => (
                          <Link
                            key={subIdx}
                            to={sub.path}
                            className={`block px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-yellow-400 hover:text-black`}
                            onClick={() => setDropdownOpen(false)}
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={idx}
                  to={nav.path}
                  className={`${linkBaseClasses} ${hoverBgClass} select-none`}
                >
                  {nav.label}
                </Link>
              )
            )}

            {!isLoggedIn ? (
              <>
                <Link
                  to="/login"
                  className={`${linkBaseClasses} ${hoverBgClass} select-none`}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className={`${linkBaseClasses} ${hoverBgClass} select-none`}
                >
                  Register
                </Link>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="px-3 py-2 rounded-md text-red-500 font-semibold hover:underline transition duration-200 select-none"
              >
                Logout
              </button>
            )}

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-md hover:bg-yellow-400 hover:text-black transition duration-200 select-none"
              aria-label="Toggle Dark Mode"
              title="Toggle Dark Mode"
            >
              {darkMode ? <BsSunFill size={20} /> : <BsMoonStarsFill size={20} />}
            </button>

            {/* Search Button */}
            <button
              onClick={toggleSearch}
              className="p-2 rounded-md hover:bg-yellow-400 hover:text-black transition duration-200 select-none"
              aria-label="Toggle Search"
              title="Toggle Search"
            >
              <FiSearch size={20} />
            </button>
          </div>

          {/* Mobile Icons */}
          <div className="lg:hidden flex gap-4 items-center">
            <button
              onClick={toggleSearch}
              className="p-2 rounded-md hover:bg-yellow-400 hover:text-black transition duration-200 select-none"
              aria-label="Toggle Search"
              title="Toggle Search"
            >
              <FiSearch size={20} />
            </button>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-md hover:bg-yellow-400 hover:text-black transition duration-200 select-none"
              aria-label="Toggle Dark Mode"
              title="Toggle Dark Mode"
            >
              {darkMode ? <BsSunFill size={20} /> : <BsMoonStarsFill size={20} />}
            </button>
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md hover:bg-yellow-400 hover:text-black transition duration-200 select-none"
              aria-label="Toggle Menu"
              title="Toggle Menu"
            >
              <FiMenu size={24} />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-3"
            >
              <SearchBar isOpen={isSearchOpen} onClose={toggleSearch} />
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Sidebar Mobile */}
   <AnimatePresence>
  {isOpen && (
    <>
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`fixed top-0 left-0 w-72 h-full z-50 p-6 overflow-y-auto shadow-2xl rounded-r-xl
          ${darkMode ? "bg-black text-yellow-400" : "bg-yellow-100 text-black"}`}
      >
        <div className="flex justify-between items-center mb-8">
          <span className="text-3xl font-extrabold select-none">Deven</span>
          <button
            onClick={toggleMenu}
            className="p-2 rounded-md hover:bg-yellow-400 hover:text-black transition duration-200 select-none"
            aria-label="Close Menu"
            title="Close Menu"
          >
            <AiOutlineClose size={24} />
          </button>
        </div>

        <nav className="flex flex-col gap-4">
          {navLinks.map((nav, idx) =>
            nav.submenu ? (
              <div key={idx}>
                <button
                  onClick={toggleMobileDropdown}
                  className={`flex items-center gap-2 text-lg font-semibold rounded-md px-3 py-2
                    transition-colors duration-200 select-none
                    ${
                      darkMode
                        ? "hover:bg-yellow-400 hover:text-black"
                        : "hover:bg-yellow-300 hover:text-black"
                    }`}
                >
                  {nav.label}
                  <AiOutlineDown
                    className={`transition-transform duration-300 ${
                      mobileDropdownOpen ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {mobileDropdownOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="ml-5 mt-1 flex flex-col gap-2"
                    >
                      {nav.submenu.map((sub, subIdx) => (
                        <Link
                          key={subIdx}
                          to={sub.path}
                          onClick={() => setIsOpen(false)}
                          className={`text-sm px-3 py-1 rounded-md transition-colors duration-200
                            ${
                              darkMode
                                ? "hover:bg-yellow-400 hover:text-black"
                                : "hover:bg-yellow-300 hover:text-black"
                            }`}
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                key={idx}
                to={nav.path}
                onClick={() => setIsOpen(false)}
                className={`text-lg rounded-md px-3 py-2 transition-colors duration-200 select-none
                  ${
                    darkMode
                      ? "hover:bg-yellow-400 hover:text-black"
                      : "hover:bg-yellow-300 hover:text-black"
                  }`}
              >
                {nav.label}
              </Link>
            )
          )}

          {!isLoggedIn ? (
            <>
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className={`rounded-md px-3 py-2 transition-colors duration-200 select-none
                  ${
                    darkMode
                      ? "hover:bg-yellow-400 hover:text-black"
                      : "hover:bg-yellow-300 hover:text-black"
                  }`}
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={() => setIsOpen(false)}
                className={`rounded-md px-3 py-2 transition-colors duration-200 select-none
                  ${
                    darkMode
                      ? "hover:bg-yellow-400 hover:text-black"
                      : "hover:bg-yellow-300 hover:text-black"
                  }`}
              >
                Register
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="px-3 py-2 rounded-md text-red-500 font-semibold hover:underline transition duration-200 select-none"
            >
              Logout
            </button>
          )}
        </nav>
      </motion.div>

      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        exit={{ opacity: 0 }}
        onClick={toggleMenu}
        className="fixed inset-0 bg-black z-40"
      />
    </>
  )}
</AnimatePresence>

    </>
  );
};

export default Navbar;
