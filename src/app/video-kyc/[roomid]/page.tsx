"use client";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useParams } from "next/navigation";
import { Video } from "lucide-react";

function page() {
  const { userData } = useSelector((state: RootState) => state.user);
  const containerRef = useRef<HTMLDivElement>(null);
  const joinedRef = useRef(false);
  const zpRef = useRef<any>(null);
  const [joined, setJoined] = useState(false);
  const { roomid } = useParams<{ roomid: string }>();

  useEffect(() => {
    return () => {
      if (zpRef.current) {
        zpRef.current.destroy();
        zpRef.current = null;
      }
      joinedRef.current = false;
    };
  }, []);

  const handleJoinCall = async () => {
    if (!containerRef.current || joinedRef.current || !userData?._id) return;

    joinedRef.current = true;
    setJoined(true);

    try {
      const { ZegoUIKitPrebuilt } = await import(
        "@zegocloud/zego-uikit-prebuilt"
      );

      const appId = Number(process.env.NEXT_PUBLIC_ZEGO_APP_ID);
      const serverSecret = process.env.NEXT_PUBLIC_ZEGO_APP_SERVER_SECRET;

      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appId,
        serverSecret!,
        roomid,
        userData._id.toString(),
        userData.name || "User",
      );

      zpRef.current = ZegoUIKitPrebuilt.create(kitToken);

      zpRef.current.joinRoom({
        container: containerRef.current,
        scenario: {
          mode: ZegoUIKitPrebuilt.OneONoneCall,
        },
        showPreJoinView: false,
      });
    } catch (error) {
      console.log(error);
      joinedRef.current = false;
      setJoined(false);
    }
  };

  return (
    <div className="relative w-screen h-screen bg-neutral-950">
      <div ref={containerRef} className="w-full h-full" />

      {!joined && (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-950">
          <div className="flex flex-col items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center">
              <Video size={36} className="text-white" />
            </div>
            <div className="text-center text-white">
              <p className="text-xl font-semibold">Video KYC</p>
              <p className="text-sm text-white/50 mt-1">Room: {roomid}</p>
            </div>
            <button
              onClick={handleJoinCall}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 transition px-10 py-3 rounded-2xl text-white font-semibold text-base"
            >
              <Video size={18} />
              Click to Join
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default page;
