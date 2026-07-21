"use client";
import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { vehicleType } from "@/models/vehicle.model";
import SearchMap from "@/components/SearchMap";

function page() {
  const router = useRouter();
  const params = useSearchParams();
  const [pickUp, setPickUp] = useState(params.get("pickup") || "");
  const [drop, setDrop] = useState(params.get("drop") || "");
  const [km, setKm] = useState<number>();
  const mobile = params.get("mobile");
  const pickUplat = params.get("pickUpLat");
  const pickUpLon = params.get("pickUpLon");
  const dropLat = params.get("dropLat");
  const dropLon = params.get("dropLon");
  const vehicle = params.get("vehicle");

  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-900 overflow-hidden">
      <div className="absolute top-5 left-5 z-50">
        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={() => router.back()}
          className="w-11 h-11 rounded-full bg-white border border-zinc-200 shadow-md flex items-center justify-center hover:bg-zinc-50 transition-colors"
        >
          <ArrowLeft size={17} className="text-zinc-900" />
        </motion.button>
      </div>
      <div className="relative w-full h-[52vh]" z-0>
        <SearchMap
          pickUp={pickUp}
          drop={drop}
          onChange={(p, d) => {
            setPickUp(p);
            setDrop(d);
          }}
          onDistance={setKm}
        />
      </div>
    </div>
  );
}

export default page;
