"use client";

import axios from "axios";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Car,
  Check,
  CircleDashed,
  IndianRupee,
  Mail,
  User,
  X,
} from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

type VehicleReview = {
  _id: string;
  owner?: {
    name?: string;
    email?: string;
  };
  type: string;
  vehicleModel: string;
  number: string;
  imageUrl?: string;
  baseFare?: number;
  pricePerKM?: number;
  waitingCharge?: number;
  status: "approved" | "pending" | "rejected";
  rejectionReason?: string;
};

function PriceRow({ label, value }: { label: string; value?: number }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border bg-white px-4 py-3">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="flex items-center gap-1 font-bold">
        <IndianRupee size={15} />
        {value ?? "N/A"}
      </span>
    </div>
  );
}

function Page() {
  const router = useRouter();
  const params = useParams();
  const id = String(params.id);

  const [vehicle, setVehicle] = useState<VehicleReview | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<"approve" | "reject" | null>(null);
  const [showReject, setShowReject] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    axios
      .get(`/api/admin/reviews/vehicle/${id}`)
      .then((response) => {
        if (!ignore) setVehicle(response.data.vehicle ?? null);
      })
      .catch((error) => {
        if (!ignore) {
          setError(
            axios.isAxiosError(error)
              ? error.response?.data?.message ?? "Vehicle review failed"
              : "Vehicle review failed",
          );
        }
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [id]);

  const handleApprove = async () => {
    setActionLoading("approve");
    setError("");

    try {
      await axios.post(`/api/admin/reviews/vehicle/${id}/approve`);
      router.push("/");
    } catch (error) {
      setError(
        axios.isAxiosError(error)
          ? error.response?.data?.message ?? "Approve failed"
          : "Approve failed",
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      setError("Rejection reason is required");
      return;
    }

    setActionLoading("reject");
    setError("");

    try {
      await axios.post(`/api/admin/reviews/vehicle/${id}/reject`, {
        rejectionReason,
      });
      router.push("/");
    } catch (error) {
      setError(
        axios.isAxiosError(error)
          ? error.response?.data?.message ?? "Reject failed"
          : "Reject failed",
      );
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center text-gray-500">
        Loading Vehicle...
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen grid place-items-center text-red-500">
        {error || "Vehicle not found"}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4">
          <button
            onClick={() => router.back()}
            className="flex h-10 w-10 items-center justify-center rounded-full border hover:bg-gray-100"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="min-w-0 flex-1">
            <p className="text-lg font-bold">Vehicle Pricing Preview</p>
            <p className="truncate text-xs text-gray-500">
              Review owner and pricing before approval
            </p>
          </div>
          <span className="rounded-full bg-yellow-100 px-4 py-2 text-xs font-bold text-yellow-700">
            {vehicle.status}
          </span>
        </div>
      </div>

      <main className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[1.3fr_0.7fr]">
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 rounded-3xl bg-white p-6 shadow-xl"
        >
          <div className="relative aspect-video overflow-hidden rounded-2xl bg-gray-100">
            {vehicle.imageUrl ? (
              <Image
                src={vehicle.imageUrl}
                alt={`${vehicle.vehicleModel} preview`}
                fill
                unoptimized
                sizes="(max-width: 1024px) 100vw, 760px"
                className="object-cover"
              />
            ) : (
              <div className="grid h-full place-items-center text-gray-400">
                No vehicle image
              </div>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <PriceRow label="Base Fare" value={vehicle.baseFare} />
            <PriceRow label="Price Per KM" value={vehicle.pricePerKM} />
            <PriceRow label="Waiting Charge" value={vehicle.waitingCharge} />
          </div>
        </motion.section>

        <motion.aside
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="space-y-6"
        >
          <div className="rounded-3xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center gap-2 font-bold">
              <User size={18} />
              Owner Details
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-xs uppercase text-gray-400">Name</p>
                <p className="font-semibold">{vehicle.owner?.name ?? "N/A"}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-gray-400">Email</p>
                <p className="flex items-center gap-2 break-all font-semibold">
                  <Mail size={15} />
                  {vehicle.owner?.email ?? "N/A"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center gap-2 font-bold">
              <Car size={18} />
              Vehicle Details
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Type</span>
                <span className="font-semibold">{vehicle.type}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Model</span>
                <span className="font-semibold">{vehicle.vehicleModel}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Number</span>
                <span className="font-semibold">{vehicle.number}</span>
              </div>
            </div>
          </div>

          {error && <p className="text-sm font-semibold text-red-500">{error}</p>}

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setShowReject(true)}
              disabled={Boolean(actionLoading)}
              className="flex items-center justify-center gap-2 rounded-2xl border bg-white py-3 font-semibold hover:bg-gray-100 disabled:opacity-60"
            >
              <X size={16} />
              Reject
            </button>
            <button
              onClick={handleApprove}
              disabled={Boolean(actionLoading)}
              className="flex items-center justify-center gap-2 rounded-2xl bg-black py-3 font-semibold text-white disabled:opacity-60"
            >
              {actionLoading === "approve" ? (
                <CircleDashed className="animate-spin" size={17} />
              ) : (
                <Check size={16} />
              )}
              Approve
            </button>
          </div>
        </motion.aside>
      </main>

      {showReject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md rounded-3xl bg-white p-6"
          >
            <h2 className="text-lg font-bold text-red-600">Reject Pricing?</h2>
            <textarea
              value={rejectionReason}
              onChange={(event) => setRejectionReason(event.target.value)}
              placeholder="Enter rejection reason"
              className="mt-4 min-h-28 w-full rounded-2xl border p-3 text-sm outline-none"
            />
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setShowReject(false)}
                className="flex-1 rounded-xl border py-2"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={actionLoading === "reject"}
                className="flex flex-1 items-center justify-center rounded-xl bg-red-600 py-2 text-white disabled:opacity-60"
              >
                {actionLoading === "reject" ? (
                  <CircleDashed className="animate-spin" size={17} />
                ) : (
                  "Reject"
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default Page;
