"use client";
import React from "react";
import { motion } from "motion/react";

const HeroSection = () => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/heroImage.jpg')" }}
      />
      <div className="absolute inset-0 bg-black/80" />
      <div className="relative z-10 min-h-screen flex flex-dol items-center justify-center px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-white font-extrabold text-4xl sm:text-5xl md:text-7xl"
        >
          Book Any Vehicle
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;
