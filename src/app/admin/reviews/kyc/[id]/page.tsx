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

  const [partner, setPartner] = useState<KycStartResponse["partner"] | null>(
    null,
  );
  const [roomId, setRoomId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    const joinKycRoom = async () => {
      try {
        setLoading(true);
        setError("");

        const { data } = await axios.get<KycStartResponse>(
          `/api/admin/video-kyc/start/${partnerId}`,
        );

        if (ignore) return;

        setPartner(data.partner);
        setRoomId(data.roomId);

        if (!containerRef.current || joinedRef.current) return;

        const { ZegoUIKitPrebuilt } = await import(
          "@zegocloud/zego-uikit-prebuilt"
        );

        const appId = Number(process.env.NEXT_PUBLIC_ZEGO_APP_ID);
        const serverSecret = process.env.NEXT_PUBLIC_ZEGO_APP_SERVER_SECRET;

        if (!appId || !serverSecret) {
          setError("Zego credentials are missing.");
          return;
        }

        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
          appId,
          serverSecret,
          data.roomId,
          `admin-${partnerId}`,
          "Admin",
        );

        const zego = ZegoUIKitPrebuilt.create(kitToken);
        joinedRef.current = true;

        zego.joinRoom({
          container: containerRef.current,
          scenario: {
            mode: ZegoUIKitPrebuilt.OneONoneCall,
          },
          showPreJoinView: false,
        });
      } catch (error: unknown) {
        if (ignore) return;

        setError(
          axios.isAxiosError(error)
            ? error.response?.data?.message ?? "Unable to join Video KYC."
            : "Unable to join Video KYC.",
        );
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    joinKycRoom();

    return () => {
      ignore = true;
    };
  }, [partnerId]);

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
            {roomId || "Preparing secure room"}
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs">
          <Video size={14} />
          Admin KYC
        </div>
      </div>

      {loading && (
        <div className="h-[calc(100vh-4rem)] grid place-items-center">
          <div className="flex items-center gap-3 text-white/70">
            <CircleDashed className="animate-spin" size={20} />
            Joining Video KYC...
          </div>
        </div>
      )}

      {error && (
        <div className="h-[calc(100vh-4rem)] grid place-items-center px-4">
          <div className="max-w-md rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-center">
            <p className="font-semibold text-red-200">Video KYC error</p>
            <p className="mt-2 text-sm text-red-100/80">{error}</p>
          </div>
        </div>
      )}

      <div
        ref={containerRef}
        className={`h-[calc(100vh-4rem)] w-full ${loading || error ? "hidden" : ""}`}
      />
    </div>
  );
}

export default Page;
