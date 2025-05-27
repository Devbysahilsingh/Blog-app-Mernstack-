import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaApple,
  FaLinkedin,
  FaInstagram,
  FaEnvelope,
} from "react-icons/fa";

const Footer = () => {
  const socialLinks = [
    {
      icon: FaLinkedin,
      href: "https://www.linkedin.com/in/kapilgattanimarketing",
      label: "LinkedIn",
    },
    {
      icon: FaInstagram,
      href: "https://www.instagram.com/gattani.kapil",
      label: "Instagram",
    },
  ];

  return (
    <motion.footer
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="bg-gradient-to-r from-[#FFD600] via-[#FFF176] to-[#FFFDE7] dark:from-[#1A1A1A] dark:via-[#2A2A2A] dark:to-[#1F1F1F] transition-all duration-700 text-black dark:text-white"
    >
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 transition-all duration-700">
          {/* Brand */}
          <div className="md:col-span-2 space-y-5">
            <h2 className="text-4xl font-extrabold tracking-tight hover:scale-105 transition-transform duration-500 select-none group">
              <span className=" group-hover:brightness-110 transition-all">
                Kapil Gatani
              </span>
            </h2>
            <p className="text-sm text-black dark:text-gray-300 max-w-sm transition-all">
              Simplifying financial news for everyone. Making complex concepts accessible through stories you love.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Explore</h3>
            <ul className="space-y-2">
              {["About", "Blog"].map((item) => (
                <li key={item}>
                  <Link
                    to={`/${item.toLowerCase()}`}
                    className="text-sm group transition-colors duration-300 hover:text-black dark:hover:text-yellow-300"
                  >
                    {item}
                    <span className="block h-0.5 bg-black dark:bg-yellow-300 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              {["Privacy Policy", "Terms & Conditions"].map((item) => (
                <li key={item}>
                  <Link
                    to={`/${item.toLowerCase().replace(/\s+/g, "-")}`}
                    className="text-sm group transition-colors duration-300 hover:text-black dark:hover:text-yellow-300"
                  >
                    {item}
                    <span className="block h-0.5 bg-black dark:bg-yellow-300 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Connect</h3>
              <a
                href="mailto:kapilgattani608@gmail.com"
                className="flex items-center gap-3 text-sm transition-colors hover:text-black dark:hover:text-yellow-300"
              >
                <FaEnvelope className="w-5 h-5" />
                kapilgattani608@gmail.com
              </a>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Follow Us</h3>
              <div className="flex gap-4">
                {socialLinks.map(({ icon: Icon, href, label }, index) => (
                  <a
                    key={index}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="p-3 rounded-full bg-white dark:bg-[#2C2C2E] hover:bg-[#FFD600] dark:hover:bg-yellow-400 hover:text-black transition-transform duration-300 shadow-md hover:scale-110"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-10 border-t border-gray-400 dark:border-gray-600 opacity-60 transition-all" />

        {/* Footer Bottom */}
        <div className="flex flex-col items-center justify-center gap-2 text-center">
          <p className="text-sm text-black dark:text-gray-300">Made with ❤️ in India</p>
          <p className="text-sm text-black dark:text-gray-300">
            © {new Date().getFullYear()} Kapil Gatani. All rights reserved.
          </p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
// this is footer