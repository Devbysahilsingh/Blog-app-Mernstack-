import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { X, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SearchBar = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const searchRef = useRef(null);
  const modalRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("recentSearches") || "[]");
    setRecentSearches(stored);
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setSuggestions([]);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/search?q=${searchTerm}`
        );
        const filtered = response.data.filter((item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSuggestions(filtered);
      } catch (err) {
        console.error("Search failed", err);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(e.target) &&
        isOpen
      ) {
        onClose();
      }
    };
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  const handleSelect = (slug, term) => {
    navigate(`/blog/detail/${slug}`);
    updateRecent(term);
    setSearchTerm("");
    setSuggestions([]);
    onClose();
  };

  const updateRecent = (term) => {
    const updated = [term, ...recentSearches.filter((t) => t !== term)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  const removeRecent = (termToRemove) => {
    const updated = recentSearches.filter((term) => term !== termToRemove);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && highlightedIndex >= 0) {
      const selected = suggestions[highlightedIndex];
      if (selected) handleSelect(selected.slug, selected.title);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-[#0D0D0D] z-40"
            onClick={onClose}
            aria-hidden="true"
          />
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="search-label"
            className="fixed top-24 left-1/2 -translate-x-1/2 w-[95%] sm:w-[90%] md:w-[80%] lg:w-[60%] xl:max-w-4xl z-50"
          >
            <div className="bg-[#F5F5F5] dark:bg-[#1C1C1E] border border-[#2C2C2E] rounded-3xl shadow-2xl max-h-[70vh] flex flex-col overflow-hidden">
              {/* Input Field */}
              <div className="flex items-center border-b border-[#2C2C2E] px-6 py-4">
                <input
                  id="search-label"
                  ref={searchRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="🔍 Search blogs by title or category..."
                  className="flex-1 bg-transparent outline-none text-[#0D0D0D] dark:text-[#FFF9C4] placeholder-gray-500 dark:placeholder-[#FDD835] text-lg font-semibold"
                  autoFocus
                />
                <button
                  onClick={onClose}
                  className="text-[#FFD600] hover:text-[#FDD835] transition ml-4"
                  aria-label="Close"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Results */}
              <div className="overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-[#FFD600] dark:scrollbar-thumb-[#FDD835] scrollbar-track-[#F5F5F5] dark:scrollbar-track-[#2C2C2E]">
                {searchTerm.trim() && suggestions.length > 0 ? (
                  suggestions.map((item, index) => (
                    <div
                      key={item._id}
                      onClick={() => handleSelect(item.slug, item.title)}
                      className={`px-6 py-4 cursor-pointer transition-colors rounded-lg ${
                        highlightedIndex === index
                          ? "bg-[#FFF9C4] dark:bg-[#FFD600]"
                          : "hover:bg-[#FDD835] dark:hover:bg-[#2C2C2E]"
                      }`}
                      role="option"
                      aria-selected={highlightedIndex === index}
                      tabIndex={-1}
                    >
                      <p className="font-semibold text-[#0D0D0D] dark:text-[#FFF9C4] truncate">
                        {item.title}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {item.category}
                      </p>
                    </div>
                  ))
                ) : searchTerm.trim() && suggestions.length === 0 ? (
                  <div className="px-6 py-4 text-center text-gray-500 dark:text-gray-400 select-none">
                    No results found
                  </div>
                ) : (
                  <>
                    <p className="px-6 pt-4 pb-2 text-sm text-gray-400 dark:text-[#FDD835] select-none font-medium tracking-wide">
                      Recent Searches
                    </p>
                    {recentSearches.length ? (
                      recentSearches.map((term, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between px-6 py-3 text-[#0D0D0D] dark:text-[#FFF9C4] hover:bg-[#FFD600] dark:hover:bg-[#2C2C2E] transition rounded-lg"
                        >
                          <button
                            onClick={() => setSearchTerm(term)}
                            className="text-left flex-1 font-medium truncate"
                          >
                            {term}
                          </button>
                          <button
                            onClick={() => removeRecent(term)}
                            className="ml-4 text-gray-400 hover:text-red-500 transition"
                            aria-label="Remove"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="px-6 py-4 text-center text-gray-500 dark:text-gray-400 select-none">
                        No recent searches
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SearchBar;
