"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { Lock, Mail, X } from "lucide-react";
import Image from "next/image";
import googleLogo from "../../public/google.jpg";


type PropType = {
  open: boolean;
  onClose: () => void;
};
type stepType = "login" | "signup" | "otp";

const AuthModal = ({ open, onClose }: PropType) => {
  const [step, setStep] = useState<stepType>("login");
  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-[90] bg-black/80 backdrop-blur-md"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="fixed inset-0 z-[100] flex items-center justify-center px-4"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-md rounded-3xl bg-white border border-black/10 shadow-[0_40px_100px_rgba(0,0,0,0.35)] p-6 sm:p-8 text-black"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-500 hover:text-black transition"
          >
            <X size={20} />
          </button>

          {/* Header */}
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-extrabold tracking-widest">Vehicle</h1>
            <p className="mt-1 text-xs text-gray-500">
              Premium Vehicle Booking
            </p>
          </div>

          <button className="w-full h-11 rounded-xl border border-black/20 flex items-center justify-center gap-3 text-sm font-semibold hover:bg-black hover:text-white transition">
            <Image src={"/google.jpg"} alt="google" width={20} height={20} />
            Continue with Google
          </button>
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-black/10" />
            <div className="text-xs text-gray-500">OR</div>
            <div className="flex-1 h-px bg-black/10" />
          </div>

          <div>
            {step === "login" && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="mt-4 space-y-4"
              >
                <h1 className="text-xl font-semibold">Welcome Back</h1>

                <div className="flex items-center gap-3 border border-black/20 rounded-xl px-4 py-3">
                  <Mail size={18} className="text-gray-500" />

                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full bg-transparent outline-none text-sm"
                  />
                </div>
                <div className="flex items-center gap-3 border border-black/20 rounded-xl px-4 py-3">
                  <Lock size={18} className="text-gray-500" />

                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full bg-transparent outline-none text-sm"
                  />
                </div>
                <button className='w-full h-11 rounded-xl bg-black text-white font-semibold hover:bg-gray-900 transition'>Login</button>

                <p className='mt-6 text-center text-sm text=gray-500'>Don't have an account? <div onClick ={() => setStep("signup")}className='text-black font-medium hover:underline'>Sign Up</div></p>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default AuthModal;
