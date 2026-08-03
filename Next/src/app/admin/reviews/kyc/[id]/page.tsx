"use client";

import axios from "axios";
import { ArrowLeft, CircleDashed, Video } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

type KycStartResponse = {
  roomId: string;
  partner: {
    _id: string;
    name: string;
    email: string;
    videoKycStatus: string;
  };
};

function Page() {
  const params = useParams();
  const router = useRouter();
  const partnerId = String(params.id);
  const containerRef = useRef<HTMLDivElement>(null);
  const joinedRef = useRef(false);

  const [partner, setPartner] = useState<KycStartResponse["partner"] | null>(null);
  const [roomId, setRoomId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    let ignore = false;

    const initKyc = async () => {
      try {
        setLoading(true);
        setError("");

        const { data } = await axios.get<KycStartResponse>(
          `/api/admin/video-kyc/start/${partnerId}`,
        );

        if (ignore) return;

        setPartner(data.partner);
        setRoomId(data.roomId);
      } catch (error: unknown) {
        if (ignore) return;
        setError(
          axios.isAxiosError(error)
            ? error.response?.data?.message ?? "Unable to prepare Video KYC."
            : "Unable to prepare Video KYC.",
        );
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    initKyc();

    return () => {
      ignore = true;
    };
  }, [partnerId]);

  const handleJoinCall = async () => {
    if (!containerRef.current || joinedRef.current || !roomId) return;

    joinedRef.current = true;
    setJoined(true);

    try {
      const { ZegoUIKitPrebuilt } = await import("@zegocloud/zego-uikit-prebuilt");

      const appId = Number(process.env.NEXT_PUBLIC_ZEGO_APP_ID);
      const serverSecret = process.env.NEXT_PUBLIC_ZEGO_APP_SERVER_SECRET;

      if (!appId || !serverSecret) {
        setError("Zego credentials are missing.");
        setJoined(false);
        joinedRef.current = false;
        return;
      }

      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appId,
        serverSecret,
        roomId,
        `admin-${partnerId}`,
        "Admin",
      );

      const zego = ZegoUIKitPrebuilt.create(kitToken);

      zego.joinRoom({
        container: containerRef.current,
        scenario: {
          mode: ZegoUIKitPrebuilt.OneONoneCall,
        },
        showPreJoinView: false,
      });
    } catch {
      setError("Failed to join the call.");
      setJoined(false);
      joinedRef.current = false;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="h-16 px-5 flex items-center gap-4 border-b border-white/10 bg-black">
        <button
          onClick={() => router.push("/")}
          className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition"
        >
          <ArrowLeft size={18} />
        </button>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold truncate">
            {partner?.name ?? "Video KYC"}
          </p>
          <p className="text-xs text-white/50 truncate">
            {roomId || "Preparing secure room..."}
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs">
          <Video size={14} />
          Admin KYC
        </div>
      </div>

      <div className="relative h-[calc(100vh-4rem)] w-full">
        <div ref={containerRef} className="h-full w-full" />

        {!joined && (
          <div className="absolute inset-0 grid place-items-center bg-neutral-950">
            {loading ? (
              <div className="flex items-center gap-3 text-white/70">
                <CircleDashed className="animate-spin" size={20} />
                Preparing room...
              </div>
            ) : error ? (
              <div className="max-w-md rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-center">
                <p className="font-semibold text-red-200">Video KYC error</p>
                <p className="mt-2 text-sm text-red-100/80">{error}</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-6">
                <div className="flex flex-col items-center gap-2 text-center">
                  <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-2">
                    <Video size={28} />
                  </div>
                  <p className="text-lg font-semibold">
                    Ready to join {partner?.name}&apos;s KYC
                  </p>
                  <p className="text-sm text-white/50">Room: {roomId}</p>
                </div>

                <button
                  onClick={handleJoinCall}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 transition px-8 py-3 rounded-2xl font-semibold text-base"
                >
                  <Video size={18} />
                  Join Call
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Page;
