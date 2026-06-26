"use client";

import DocPreview from "@/components/DocPreview";
import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, CircleDashed, FileCheck, UploadCloud } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";

type DocsType = "aadhar" | "license" | "rc";

type ExistingDocs = {
  aadharUrl?: string;
  licenseUrl?: string;
  rcUrl?: string;
};

const Page = () => {
  const router = useRouter();

  const [docs, setDocs] = useState<Record<DocsType, File | null>>({
    aadhar: null,
    license: null,
    rc: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [existingDocs, setExistingDocs] = useState<ExistingDocs | null>(null);

  const handleImage = (doc: DocsType, file: File | null) => {
    if (!file) return;

    setDocs((prev) => ({
      ...prev,
      [doc]: file,
    }));
  };

  const handleDocs = async () => {
    setError("");

    if (!existingDocs && (!docs.aadhar || !docs.license || !docs.rc)) {
      setError("Please upload all required documents.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      if (docs.aadhar) formData.append("aadhar", docs.aadhar);
      if (docs.license) formData.append("license", docs.license);
      if (docs.rc) formData.append("rc", docs.rc);

      const { data } = await axios.post(
        "/api/partner/onboarding/documents",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      console.log(data);

      router.push("/partner/onboarding/bank");
    } catch (error: unknown) {
      console.error(error);

      setError(
        axios.isAxiosError(error)
          ? error.response?.data?.message ?? "Failed to upload documents."
          : "Failed to upload documents.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleGetDocs = async () => {
      try {
        const { data } = await axios.get("/api/partner/onboarding/documents");
        setExistingDocs(data.partnerDocs ?? null);
      } catch (error: unknown) {
        if (!axios.isAxiosError(error) || error.response?.status !== 404) {
          console.error(error);
          setError(
            axios.isAxiosError(error)
              ? error.response?.data?.message ?? "Failed to load documents."
              : "Failed to load documents.",
          );
        }
      }
    };

    handleGetDocs();
  }, []);

  const isCompleted =
    Boolean(existingDocs) || Boolean(docs.aadhar && docs.license && docs.rc)

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
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

          <p className="text-xs text-gray-500 font-medium">Step 2 of 3</p>

          <h1 className="text-2xl font-bold mt-1">Upload Documents</h1>

          <p className="text-sm text-gray-500 mt-2">
            Required for verification
          </p>
        </div>

        {/* Upload Fields */}
        <div className="mt-8 space-y-5">
          {existingDocs && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <DocPreview label="Aadhaar" url={existingDocs.aadharUrl} />
              <DocPreview label="Driving License" url={existingDocs.licenseUrl} />
              <DocPreview label="Vehicle RC" url={existingDocs.rcUrl} />
            </div>
          )}

          {/* Aadhaar */}
          <motion.label
            whileHover={{ scale: 1.02 }}
            className="flex items-center justify-between p-4 rounded-2xl border border-gray-200 cursor-pointer hover:border-black transition"
          >
            <div>
              <p className="text-sm font-semibold">Aadhaar / ID Proof</p>
              <p className="text-xs text-gray-500">Government-issued ID</p>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`text-xs font-medium ${
                  docs.aadhar || existingDocs?.aadharUrl
                    ? "text-green-600"
                    : "text-gray-400"
                }`}
              >
                {docs.aadhar ? "Uploaded ✓" : "Upload"}
              </span>

              <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center">
                <UploadCloud size={18} />
              </div>
            </div>

            <input
              type="file"
              hidden
              accept="image/*,.pdf"
              onChange={(e) =>
                handleImage("aadhar", e.target.files?.[0] || null)
              }
            />
          </motion.label>

          {/* License */}
          <motion.label
            whileHover={{ scale: 1.02 }}
            className="flex items-center justify-between p-4 rounded-2xl border border-gray-200 cursor-pointer hover:border-black transition"
          >
            <div>
              <p className="text-sm font-semibold">Driving License</p>
              <p className="text-xs text-gray-500">Valid driving license</p>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`text-xs font-medium ${
                  docs.license || existingDocs?.licenseUrl
                    ? "text-green-600"
                    : "text-gray-400"
                }`}
              >
                {docs.license ? "Uploaded ✓" : "Upload"}
              </span>

              <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center">
                <UploadCloud size={18} />
              </div>
            </div>

            <input
              type="file"
              hidden
              accept="image/*,.pdf"
              onChange={(e) =>
                handleImage("license", e.target.files?.[0] || null)
              }
            />
          </motion.label>

          {/* RC */}
          <motion.label
            whileHover={{ scale: 1.02 }}
            className="flex items-center justify-between p-4 rounded-2xl border border-gray-200 cursor-pointer hover:border-black transition"
          >
            <div>
              <p className="text-sm font-semibold">Vehicle RC</p>
              <p className="text-xs text-gray-500">Registration Certificate</p>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`text-xs font-medium ${
                  docs.rc || existingDocs?.rcUrl
                    ? "text-green-600"
                    : "text-gray-400"
                }`}
              >
                {docs.rc ? "Uploaded ✓" : "Upload"}
              </span>

              <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center">
                <UploadCloud size={18} />
              </div>
            </div>

            <input
              type="file"
              hidden
              accept="image/*,.pdf"
              onChange={(e) => handleImage("rc", e.target.files?.[0] || null)}
            />
          </motion.label>
        </div>

        {/* Security Note */}
        <div className="mt-6 flex items-start gap-3 text-xs text-gray-500">
          <FileCheck size={18} />
          <p className="mt-0.5">
            Documents are securely stored and manually verified by our team.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <p className="mt-4 text-center text-sm text-red-500">{error}</p>
        )}

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          disabled={!isCompleted ||loading}
          onClick={handleDocs}
          className="mt-8 w-full h-14 rounded-2xl bg-black text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-40 transition"
        >
          {loading ? (
            <CircleDashed className="text-white animate-spin" size={20} />
          ) : (
            "Continue"
          )}
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Page;
