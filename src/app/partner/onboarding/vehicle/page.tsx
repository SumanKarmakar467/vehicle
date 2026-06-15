"use client";
import React, { useState } from "react";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Bike,
  Car,
  CircleDashed,
  Package,
  Truck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";

const VEHICLES = [
  { id: "bike", label: "Bike", icon: Bike, desc: "2 wheeler" },
  { id: "auto", label: "Auto", icon: Car, desc: "3 wheeler ride" },
  { id: "car", label: "Car", icon: Car, desc: "4 wheeler" },
  { id: "loading", label: "Loading", icon: Package, desc: "Small goods" },
  { id: "truck", label: "Truck", icon: Truck, desc: "Heavy transport" },
];

const Page = () => {
  const router = useRouter();

  const [vehicleType, setVehicleType] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVehicle = async () => {
    try {
      setError("");

      if (!vehicleType || !vehicleNumber || !vehicleModel) {
        setError("Please fill all vehicle details");
        return;
      }

      setLoading(true);

      const { data } = await axios.post(
        "/api/partner/onboarding/vehicle",
        {
          type: vehicleType,
          number: vehicleNumber,
          vehicleModel,
        }
      );

      console.log(data);

      // Next step
      router.push("/partner/dashboard");
    } catch (error: any) {
      setError(
        error?.response?.data?.message ?? "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-xl bg-white rounded-3xl border border-gray-200 shadow-[0_25px_70px_rgba(0,0,0,0.15)] p-6 sm:p-8"
      >
        {/* Header */}
        <div className="relative text-center">
          <button
            onClick={() => router.back()}
            className="absolute left-0 top-0 w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition"
          >
            <ArrowLeft size={18} />
          </button>

          <p className="text-xs text-gray-500 font-medium">
            Step 3 of 3
          </p>

          <h1 className="text-2xl font-bold mt-1">
            Vehicle Details
          </h1>

          <p className="text-sm text-gray-500 mt-2">
            Add your vehicle information
          </p>
        </div>

        {/* Vehicle Types */}
        <div className="mt-8 space-y-6">
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-3">
              Vehicle Type
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {VEHICLES.map((v) => {
                const Icon = v.icon;
                const active = vehicleType === v.id;

                return (
                  <motion.div
                    key={v.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setVehicleType(v.id)}
                    className={`rounded-2xl border p-4 flex flex-col items-center gap-2 cursor-pointer transition ${
                      active
                        ? "bg-black text-white border-black"
                        : "border-gray-200 hover:border-black"
                    }`}
                  >
                    <div
                      className={`w-11 h-11 rounded-full flex items-center justify-center ${
                        active
                          ? "bg-white text-black"
                          : "bg-black text-white"
                      }`}
                    >
                      <Icon size={20} />
                    </div>

                    <div className="text-sm font-semibold">
                      {v.label}
                    </div>

                    <p
                      className={`text-xs ${
                        active
                          ? "text-gray-300"
                          : "text-gray-500"
                      }`}
                    >
                      {v.desc}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Vehicle Number */}
          <div>
            <label
              htmlFor="vn"
              className="text-xs font-semibold text-gray-500"
            >
              Vehicle Number
            </label>

            <input
              id="vn"
              type="text"
              value={vehicleNumber}
              onChange={(e) =>
                setVehicleNumber(e.target.value.toUpperCase())
              }
              placeholder="WB12AB1234"
              className="mt-2 w-full border-b border-gray-300 pb-2 text-sm focus:outline-none focus:border-black transition"
            />
          </div>

          {/* Vehicle Model */}
          <div>
            <label
              htmlFor="vm"
              className="text-xs font-semibold text-gray-500"
            >
              Vehicle Model
            </label>

            <input
              id="vm"
              type="text"
              value={vehicleModel}
              onChange={(e) =>
                setVehicleModel(e.target.value)
              }
              placeholder="Tata Ace"
              className="mt-2 w-full border-b border-gray-300 pb-2 text-sm focus:outline-none focus:border-black transition"
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-500 text-sm mt-4">
            * {error}
          </p>
        )}

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          disabled={loading}
          onClick={handleVehicle}
          className="mt-8 w-full h-14 rounded-2xl bg-black text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50 transition"
        >
          {loading ? (
            <>
              <CircleDashed className="animate-spin" size={18} />
              Processing...
            </>
          ) : (
            "Continue"
          )}
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Page;