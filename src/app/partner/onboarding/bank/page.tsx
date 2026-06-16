"use client";

import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  ArrowLeft,
  BadgeCheck,
  CheckCircle,
  CircleDashed,
  CreditCard,
  Landmark,
  Phone,
} from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";

const Page = () => {
  const router = useRouter();

  const [accountHolder, setAccountHolder] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [upi, setUpi] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleBank = async () => {
    setError("");

    if (
      !accountHolder ||
      !accountNumber ||
      !ifsc ||
      !mobileNumber
    ) {
      setError("Please fill all required fields.");
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.post(
        "/api/partner/onboarding/bank",
        {
          accountHolder,
          accountNumber,
          ifsc,
          upi,
          mobileNumber,
        }
      );

      console.log(data);

      router.push("/partner/dashboard");
    } catch (error: any) {
      console.error(error);

      setError(
        error?.response?.data?.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };


useEffect(() => {
  const handleGetBank = async () => {
    try {
      const { data } = await axios.get(
        "/api/partner/onboarding/bank"
      );

      console.log(data);

      setAccountHolder(
        data.partnerBank?.accountHolder || ""
      );

      setAccountNumber(
        data.partnerBank?.accountNumber || ""
      );

      setIfsc(
        data.partnerBank?.ifsc || ""
      );

      setUpi(
        data.partnerBank?.upi || ""
      );

      setMobileNumber(
        data.mobileNumber || ""
      );
    } catch (error: any) {
      if (error.response?.status !== 404) {
        console.error(error);
      }
    }
  };

  handleGetBank();
}, []);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
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
            Bank & Payout Setup
          </h1>

          <p className="text-sm text-gray-500 mt-2">
            Used for partner payouts
          </p>
        </div>

        {/* Form */}
        <div className="mt-8 space-y-6">
          <div>
            <label
              htmlFor="accountHolder"
              className="text-xs font-semibold text-gray-500"
            >
              Account Holder Name
            </label>

            <div className="flex items-center gap-2 mt-2">
              <div className="text-gray-400">
                <BadgeCheck />
              </div>

              <input
                id="accountHolder"
                type="text"
                placeholder="As per bank records"
                className="flex-1 border-b pb-2 text-sm focus:outline-none border-gray-300 focus:border-black"
                value={accountHolder}
                onChange={(e) =>
                  setAccountHolder(e.target.value)
                }
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="accountNumber"
              className="text-xs font-semibold text-gray-500"
            >
              Bank Account Number
            </label>

            <div className="flex items-center gap-2 mt-2">
              <div className="text-gray-400">
                <CreditCard />
              </div>

              <input
                id="accountNumber"
                type="text"
                placeholder="Enter account number"
                className="flex-1 border-b pb-2 text-sm focus:outline-none border-gray-300 focus:border-black"
                value={accountNumber}
                onChange={(e) =>
                  setAccountNumber(e.target.value)
                }
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="ifsc"
              className="text-xs font-semibold text-gray-500"
            >
              IFSC Code
            </label>

            <div className="flex items-center gap-2 mt-2">
              <div className="text-gray-400">
                <Landmark />
              </div>

              <input
                id="ifsc"
                type="text"
                placeholder="HDFC0001234"
                className="flex-1 border-b pb-2 text-sm focus:outline-none border-gray-300 focus:border-black uppercase"
                value={ifsc}
                onChange={(e) =>
                  setIfsc(e.target.value.toUpperCase())
                }
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="mobile"
              className="text-xs font-semibold text-gray-500"
            >
              Mobile Number
            </label>

            <div className="flex items-center gap-2 mt-2">
              <div className="text-gray-400">
                <Phone />
              </div>

              <input
                id="mobile"
                type="tel"
                placeholder="10 digit mobile number"
                className="flex-1 border-b pb-2 text-sm focus:outline-none border-gray-300 focus:border-black"
                value={mobileNumber}
                onChange={(e) =>
                  setMobileNumber(e.target.value)
                }
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="upi"
              className="text-xs font-semibold text-gray-500"
            >
              UPI ID (Optional)
            </label>

            <div className="flex items-center gap-2 mt-2">
              <input
                id="upi"
                type="text"
                placeholder="name@upi"
                className="flex-1 border-b pb-2 text-sm focus:outline-none border-gray-300 focus:border-black"
                value={upi}
                onChange={(e) => setUpi(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <p className="mt-4 text-sm text-red-500">
            * {error}
          </p>
        )}

        {/* Info */}
        <div className="mt-6 flex items-start gap-3 text-xs text-gray-500">
          <CheckCircle size={16} className="mt-0.5" />
          <p>
            Bank details are verified before the first payout.
            This usually takes 24–48 hours.
          </p>
        </div>

        {/* Submit */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          disabled={loading}
          onClick={handleBank}
          className="mt-8 w-full h-14 rounded-2xl bg-black text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-40 transition"
        >
          {loading ? (
            <>
              <CircleDashed
                className="animate-spin"
                size={18}
              />
              Saving...
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