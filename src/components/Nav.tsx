"use client";

import { motion } from "motion/react";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AuthModal from "./AuthModal";

const Nav_Items = ["Home", "Bookings", "About Us", "Contact"];

const Nav = () => {
  const [authOpen, setAuthOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <motion.div
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-3 left-1/2 -translate-x-1/2 w-[94%] md:w-[86%] z-50 rounded-full bg-[#0B0B0B] text-white shadow-[0_15px_50px_rgba(0,0,0,0.7)] py-3"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
          <Image src="/logo.png" alt="logo" width={44} height={44} priority />

          <div className="hidden md:flex items-center gap-10">
            {Nav_Items.map((item, index) => {
              let href;
              if (item == "Home") {
                href = "/";
              } else {
                href = "$/{item.toLowerCase()}";
              }
              href =
                item === "Home"
                  ? "/"
                  : `/${item.toLowerCase().replace(/\s+/g, "-")}`;

              const active = pathname === href;

              return (
                <Link
                  key={item}
                  href={href}
                  className={`text-sm font-medium transition ${
                    active ? "text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  {item}
                </Link>
              );
            })}
          </div>

          <button
            className="px-4 py-1.5 rounded-full bg-white text-black text-sm"
            onClick={() => setAuthOpen(true)}
          >
            Login
          </button>
        </div>
      </motion.div>
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
};

export default Nav;
