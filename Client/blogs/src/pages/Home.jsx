import React from "react";
import Hero from "../Components/Hero";
import Blog from "./Blog";

const Home = () => {
  return (
    <div className="w-full dark:bg-[#1C1C1E] overflow-x-hidden">
      <div className="max-w-screen mx-auto px-4">
        <Hero />
        {/* Optionally include Gallery and Subscribe when needed */}
      </div>
        <Blog />
    </div>
  );
};

export default Home;
