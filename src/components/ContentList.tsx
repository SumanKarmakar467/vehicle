"use client";

import React from "react";
import { motion } from "motion/react";
import { ArrowRight, CheckCircle, User } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";

type ContentItem = {
  _id: string;
  name: string;
  email: string;
  videoKycStatus?:
    | "not_required"
    | "pending"
    | "in_progress"
    | "approved"
    | "rejected";
};

type ContentListProps = {
  data: ContentItem[];
  type: "partner" | "kyc" | "vehicle";
};

function ContentList({ data, type }: ContentListProps) {
  const router = useRouter();

  const handleStartVideoKyc = async (id: string) => {
    try {
      const { data } = await axios.get(`/api/admin/video-kyc/start/${id}`);

      console.log(data);

      router.push(`/admin/reviews/kyc/${id}`);
    } catch (error) {
      console.error("Failed to start Video KYC:", error);
    }
  };

  const handleNavigation = (id: string) => {
    switch (type) {
      case "partner":
        router.push(`/admin/reviews/partner/${id}`);
        break;

      case "kyc":
        router.push(`/admin/reviews/kyc/${id}`);
        break;

      case "vehicle":
        router.push(`/admin/reviews/vehicle/${id}`);
        break;
    }
  };

  if (!data || data.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-2xl py-16 text-center border border-dashed border-gray-200 shadow-sm"
      >
        <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={22} className="text-green-400" />
        </div>

        <p className="font-bold text-gray-800 text-base">
          All caught up!
        </p>

        <p className="text-sm text-gray-400 mt-1">
          No pending items right now.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1 mb-1">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
          {type === "partner"
            ? "Partner Reviews Queue"
            : type === "kyc"
            ? "Pending Video KYC Queue"
            : "Vehicle Reviews Queue"}
        </p>

        <p className="text-xs text-gray-400">
          {data.length} items
        </p>
      </div>

      {data.map((item, index) => {
        const { _id, name, email, videoKycStatus } = item;

        let buttonText = "Review";

        if (
          type === "kyc" &&
          (!videoKycStatus ||
            videoKycStatus === "pending" ||
            videoKycStatus === "not_required")
        ) {
          buttonText = "Start Video KYC";
        } else if (type === "kyc" && videoKycStatus === "in_progress") {
          buttonText = "Join Call";
        }

        const handleButtonClick = () => {
          if (
            type === "kyc" &&
            (!videoKycStatus ||
              videoKycStatus === "pending" ||
              videoKycStatus === "not_required")
          ) {
            handleStartVideoKyc(_id);
          } else {
            handleNavigation(_id);
          }
        };

        return (
          <motion.div
            key={_id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{
              y: -3,
              boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
            }}
            className="bg-white border border-gray-100 rounded-2xl px-5 py-4 shadow-sm transition-shadow"
          >
            <div className="flex items-center justify-between w-full gap-4">
              {/* Left */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 bg-purple-100 text-purple-800">
                  {name ? name.charAt(0).toUpperCase() : <User size={14} />}
                </div>

                <div className="min-w-0">
                  <p className="font-bold text-sm text-gray-900 truncate">
                    {name}
                  </p>

                  <p className="text-xs text-gray-400 truncate">
                    {email}
                  </p>
                </div>
              </div>

              {/* Right */}
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={handleButtonClick}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-semibold transition-colors shrink-0 ${
                  type === "kyc" && videoKycStatus === "in_progress"
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-neutral-950 hover:bg-neutral-800"
                }`}
              >
                {buttonText}
                <ArrowRight size={15} />
              </motion.button>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export default ContentList;
