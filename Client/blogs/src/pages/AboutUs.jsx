import React from 'react';
import { motion } from 'framer-motion';
import avatar from "../assets/avatar.png";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const AboutUs = () => {
  return (
    <div className="bg-[#F5F5F5] dark:bg-[#1C1C1E] py-16 px-4 sm:px-6 lg:px-8 text-gray-900 dark:text-white">
      <div className="max-w-5xl mx-auto space-y-20">

        {/* Hero Quote Section */}
        <motion.section
          variants={fadeInUp}
          initial="hidden"
          animate="show"
          className="text-center space-y-4"
        >
          <blockquote className="text-3xl sm:text-4xl font-bold text-[#0D0D0D] dark:text-[#FFF9C4] leading-tight">
            "Someone might reach there faster, but we'll get there stronger."
          </blockquote>
          <p className="text-lg text-[#0D0D0D]dark:text-[#FFD600] font-medium">
            This isn't just a quote—it's the fuel behind our journey.
          </p>
        </motion.section>

        {/* Founder Intro */}
        <motion.section
          variants={fadeInUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="flex flex-col md:flex-row gap-10 items-center"
        >
          <div className="md:w-1/3">
            <div className="rounded-xl bg-gradient-to-br from-[#FDD835] to-[#FFF9C4] p-1">
              <img
                src={avatar}
                alt="Kapil Gattani"
                className="rounded-lg shadow-md object-cover w-full h-auto"
              />
            </div>
          </div>
          <div className="md:w-2/3 space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0D0D0D] dark:text-[#FFF9C4]">
              At just 23, I—Kapil Gattani—am on a mission to change how India sees startups.
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              As a marketer, entrepreneur, and founder of Royal Floss, I didn't just want to build a brand. I wanted to rewrite the narrative of what tradition can taste like when fused with modern vision.
            </p>
          </div>
        </motion.section>

        {/* Brand Story */}
        <motion.section
          variants={fadeInUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="bg-yellow-300 dark:bg-[#2C2C2E] rounded-xl p-8 shadow-lg"
        >
          <h3 className="text-xl font-bold mb-4 text-[#0D0D0D] dark:text-white">Our Story</h3>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Royal Floss began as a simple idea: to reimagine Indian sweets, one box at a time.
            What started as a spark has now ignited into a brand that, in its very first year,
            sold over <span className="font-bold text-[#0D0D0D] dark:text-[#FFD600]">60,000 boxes</span>. And within 2 years,
            it skyrocketed to <span className="font-bold text-[#0D0D0D] dark:text-[#FFD600]">110,000 boxes</span>.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-[#1C1C1E] text-center p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
              <p className="text-3xl font-bold text-[#FFD600]">60K+</p>
              <p className="text-gray-600 dark:text-gray-400">Boxes in Year 1</p>
            </div>
            <div className="bg-white dark:bg-[#1C1C1E] text-center p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
              <p className="text-3xl font-bold text-[#FFD600]">110K+</p>
              <p className="text-gray-600 dark:text-gray-400">Boxes by Year 2</p>
            </div>
          </div>
        </motion.section>

        {/* Journey Section */}
        <motion.section
          variants={fadeInUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="space-y-6"
        >
          <h3 className="text-xl font-bold text-[#0D0D0D] dark:text-[#FFF9C4]">The Journey</h3>
          <p className="text-gray-700 dark:text-gray-300">
            But before this journey began, I was a Half CA, a stock analyst, and even an assistant marketer at a packed-food startup in Mumbai.
            Each chapter was less about climbing ladders and more about falling, learning, and climbing better.
          </p>
          <div className="bg-[#FDD835] dark:bg-[#FFD600] border-l-4 border-[#0D0D0D] dark:border-white p-4 rounded">
            <p className="italic text-[#1C1C1E] dark:text-[#0D0D0D]">
              "If entrepreneurship is a classroom, then failure is the best professor I've had."
            </p>
          </div>
        </motion.section>

        {/* Closing */}
        <motion.section
          variants={fadeInUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="text-center space-y-4"
        >
          <h3 className="text-xl font-bold text-[#0D0D0D] dark:text-[#FFF9C4]">Join Our Journey</h3>
          <p className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            So Deven is not just a page. It's an open door. To those who dream, build, fail, and rise — just like we did.
            Let's grow together, because every moment is an opportunity, and the best stories in business are still being written.
          </p>
          <p className="text-gray-600 dark:text-gray-400">Thanks for being here.</p>
          <p className="font-bold text-[#0D0D0D] dark:text-white">– Kapil Gattani</p>
          <p className="font-bold text-blue-500">Founder, Royal Floss</p>
        </motion.section>
      </div>
    </div>
  );
};

export default AboutUs;
