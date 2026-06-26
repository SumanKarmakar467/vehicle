"use client";

import axios from "axios";
import {motion} from "motion/react"
import {
  CheckCircle2,
  Clock,
  Truck,
  User,
  Users,
  Video,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Kpi from "./Kpi";
import TapButton from "./TapButton";
import ContentList from "./ContentList";
import { AnimatePresence } from "framer-motion";

type Stats = {
  totalApprovedPartners: number;
  totalPartners: number;
  totalPendingPartners: number;
  totalRejectedPartners: number;
};

type Tab = "partner" | "kyc" | "vehicle";

function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("partner");

  const [partnerReviews, setPartnerReviews] = useState<any[]>([]);
  const [pendingKyc, setPendingKyc] = useState<any[]>([]);
  const [vehicleReviews, setVehicleReviews] = useState<any[]>([]);

  const handleGetData = async () => {
    try {
      const { data } = await axios.get("/api/admin/dashboard");
      setStats(data.stats);
      setPartnerReviews(data.pendingPartnersReviews || []);
      setPendingKyc(data.pendingKyc || []);
      setVehicleReviews(data.vehicleReviews || []);
    } catch (error) {
      console.error("Dashboard Error:", error);
    }
  };

  const handleGetPendingKYC=async() => {
    try{
      const {data} =await axios.get("/api/admin/video-kyc/pending")
      setPendingKyc(data)
    }
    catch(error){
      console.log(error)
    }
  }

  useEffect(() => {
    handleGetData();
    handleGetPendingKYC();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto h-16 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="logo"
              width={44}
              height={44}
              priority
            />
          </div>

          <div className="flex items-center gap-2 rounded-full bg-black text-white px-3 py-1.5 text-xs">
            <User size={14} />
            Admin Dashboard
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-12 space-y-16">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          <Kpi
            label="Total Partners"
            value={stats?.totalPartners ?? 0}
            icon={<Users />}
            variant="totalPartners"
          />

          <Kpi
            label="Approved Partners"
            value={stats?.totalApprovedPartners ?? 0}
            icon={<CheckCircle2 />}
            variant="approved"
          />

          <Kpi
            label="Pending Partners"
            value={stats?.totalPendingPartners ?? 0}
            icon={<Clock />}
            variant="pending"
          />

          <Kpi
            label="Rejected Partners"
            value={stats?.totalRejectedPartners ?? 0}
            icon={<XCircle />}
            variant="rejected"
          />
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl p-2 shadow-lg border border-gray-100 flex flex-wrap gap-2">
          <TapButton
            active={activeTab === "partner"}
            count={partnerReviews.length}
            icon={<Users size={15} />}
            onClick={() => setActiveTab("partner")}
          >
            Partner Reviews
          </TapButton>

          <TapButton
            active={activeTab === "kyc"}
            count={pendingKyc.length}
            icon={<Video size={15} />}
            onClick={() => setActiveTab("kyc")}
          >
            Pending Video KYC
          </TapButton>

          <TapButton
            active={activeTab === "vehicle"}
            count={vehicleReviews.length}
            icon={<Truck size={15} />}
            onClick={() => setActiveTab("vehicle")}
          >
            Vehicle Reviews
          </TapButton>
        </div>

        

        <AnimatePresence mode='wait'>
          <motion.div
          key={activeTab}
          initial={{opacity:0,y:16}}
          animate={{opacity:1,y:0}}
          exit={{opacity:0,y:-8}}
          transition={{duration:0.2, ease:"easeOut"}}
          className="space-y-3"
          >
            {activeTab=="partner" && <ContentList data={partnerReviews ?? []} type={"partner"}/>}
            {activeTab=="kyc" && <ContentList data={pendingKyc ?? []} type={"kyc"}/>}
            {activeTab=="vehicle" && <ContentList data={vehicleReviews ?? []} type={"vehicle"}/>}
          </motion.div>

        </AnimatePresence>
      </main>
    </div>
  );
}

export default AdminDashboard;
