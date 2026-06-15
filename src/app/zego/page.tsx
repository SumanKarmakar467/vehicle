"use client";
import React, { useRef } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

function page() {
  const { userData } = useSelector((state: RootState) => state.user);
  const containerRef = useRef<HTMLDivElement>(null);

  const startCall = async () => {
    if (!containerRef.current) return;

    try {
      const { ZegoUIKitPrebuilt } =
        await import("@zegocloud/zego-uikit-prebuilt");

      const appId = Number(process.env.NEXT_PUBLIC_ZEGO_APP_ID);
      const serverSecret = process.env.NEXT_PUBLIC_ZEGO_APP_SERVER_SECRET;

      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appId,
        serverSecret!,
        "jhishfi", // room ID
        userData?._id.toString()!,
        "suman",
      );

      const zp = ZegoUIKitPrebuilt.create(kitToken);

      zp.joinRoom({
        container: containerRef.current,
        scenario: {
          mode: ZegoUIKitPrebuilt.OneONoneCall,
        },
        showPreJoinView: false,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div ref={containerRef} className="w-screen h-screen">
      <button onClick={startCall}>Click</button>
    </div>
  );
}

export default page;
