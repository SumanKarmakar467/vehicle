"use client";

import { AnimatePresence, motion } from "motion/react";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AuthModal from "./AuthModal";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { Bike, Car, ChevronRight, LogOut, Menu, Truck } from "lucide-react";
import { signOut } from "next-auth/react";
import { setUserData } from "@/redux/userSlice";
const Nav_Items = ["Home", "Bookings", "About Us", "Contact"];

const Nav = () => {
  const [authOpen, setAuthOpen] = useState(false);
  const pathname = usePathname();
  const [profileopen, setProfileopen] = useState(false);
  const { userData } = useSelector((state: RootState) => state.user);
  const [menuOpen, setMenuOpen] = useState(false)

  const dispatch=useDispatch<AppDispatch>()
  const handleLogOut=async() => {
    await signOut({redirect:false})
    dispatch(setUserData(null))
    setProfileopen(false)
  }
console.log("Redux userData:", userData);
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

          <div className="flex items-center gap-3 relative">

            {/* Reponsive for desktop */}
            <div className="hidden md:block relative">
              {!userData ? (
                <button
                  className="px-4 py-1.5 rounded-full bg-white text-black text-sm"
                  onClick={() => setAuthOpen(true)}
                >
                  Login
                </button>
              ) : (
                <>
                  <button
                    className="w-11 h-11 rounded-full bg-white text-black font-bold"
                    onClick={() => setProfileopen((p) => !p)}
                  >
                    {userData?.name?.charAt(0)?.toUpperCase()}
                  </button>
                  <AnimatePresence>
                    {profileopen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{opacity:0 , y:-10}}
                        className="absolute top-14 right-0 w-[300px] bg-white text-black rounded-xl shadow-xl border"
                      >
                        <div className='p-5'>
                          <p className='font-semibold text-lg'>{userData?.name}</p>
                          <p className='text-xs uppercase text-gray-500 mb-4'>{userData?.role}</p>
                          {userData.role!="partner" && (
                            <div className='w-full flex items-center gap-3 py-3 hover:bg-gray-100 rounded-xl' >
                              <div className='flex -space-x-2'>
                                <div className='w-6 h-6 rounded-full bg-black text-white flex items-center justify-center'><Bike size={16}/></div>
                                <div className='w-6 h-6 rounded-full bg-black text-white flex items-center justify-center'><Car size={16}/></div>
                                <div className='w-6 h-6 rounded-full bg-black text-white flex items-center justify-center'><Truck size={16}/></div>
                              </div>
                              Become a Partner
                            <ChevronRight size={16} className='ml-auto'/>
                            </div>

                          )}

                          <button className='w-full flex items-center gap-3 py-3 hover:bg-gray-100 rounded-xl mt-2' onClick={handleLogOut}>
                            <LogOut size={16}/>
                            Log Out</button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}
            </div>


            {/* Responsive for Mobile */}
            <div className="md:hidden">
              {!userData ? (
                <button
                  className="px-4 py-1.5 rounded-full bg-white text-black text-sm"
                  onClick={() => setAuthOpen(true)}
                >
                  Login
                </button>
              ) : (
                <>
                  <button
                    className="w-11 h-11 rounded-full bg-white text-black font-bold"
                    onClick={() => setProfileopen((p) => !p)}
                  >
                    {userData?.name?.charAt(0)?.toUpperCase()}
                  </button>
                
                </>
              )}
            </div>

            <button className='md:hidden text-white onClick={() => setMenuOpen(p=>!p)}'>
              <Menu/>
            </button>

          </div>
        </div>
      </motion.div>
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
};

export default Nav;
