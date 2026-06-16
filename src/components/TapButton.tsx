"use client";

import React from "react";
import { motion } from "motion/react";

type TapButtonProps = {
  active: boolean;
  count: number;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
};

function TapButton({
  active,
  count,
  onClick,
  icon,
  children,
}: TapButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      className={`relative flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200 select-none ${
        active
          ? "bg-neutral-950 text-white shadow-lg shadow-black/20"
          : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
      }`}
    >
      {icon}

      <span>{children}</span>

      <span
        className={`px-2 py-0.5 rounded-full text-xs ${
          active
            ? "bg-white/20 text-white"
            : "bg-gray-200 text-gray-700"
        }`}
      >
        {count}
      </span>
    </motion.button>
  );
}

export default TapButton;