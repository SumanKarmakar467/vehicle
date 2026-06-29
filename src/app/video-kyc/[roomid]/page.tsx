"use client";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useParams } from "next/navigation";
import { Video } from "lucide-react";
import Image from "next/image";

export default function Page() {
  const { userData } = useSelector((state: RootState) => state.user);
  // const containerRef = useRef<HTMLDivElement>(null);
  const joinedRef = useRef(false);
  const zpRef = useRef<any>(null);
  const [joined, setJoined] = useState(false);
  const { roomid } = useParams<{ roomid: string }>();
  const previewRef = useRef<HTMLVideoElement>(null);
  const [strem, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    if (joine\d) return;
    let localstream: MediaStream;
    const init = async () => {
      try {
        localstream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        console.log(localstream);
console.log(localstream.getVideoTracks());
        setStream(localstream);
        if (previewRef.current) {
          previewRef.current.srcObject = localstream;
        }
        setJoined(true);
      } catch (error) {
        console.log(error);
      }
    };
    init();
  }, []);



  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <div className="px-6 py-4 border-b border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Image src="/logo.png" alt="logo" width={44} height={44} priority />
          <p className="text-xs text-gray-400">
            {userData?.role == "admin"
              ? "Admin Verification"
              : "Partner Video KYC"}
          </p>
        </div>
        <div className="flex-1 relative">
          {joined && (
            <div className="h-full flex items-center justify-center px-4 py-10">
              <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-white/5">
                  <video
                    ref={previewRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-[300px] sm:h-[400px] object-cover"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

