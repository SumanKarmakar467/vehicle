import { auth } from "@/auth";
import connectDb from "@/lib/db";
import User from "@/models/user.model";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const session = await auth();
    // Authorization
    if (!session || !session.user?.email || session.user?.role !== "admin") {
      return Response.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 400 },
      );
    }
    const { roomId, action, reason } = await req.json();
    if (!roomId) {
      return Response.json(
        {
          success: false,
          message: "Room Id is required",
        },
        { status: 400 },
      );
    }

    if (["approved", "rejected"].includes(action)) {
      return Response.json(
        {
          success: false,
          message: "Invalid action",
        },
        { status: 400 },
      );
    }

    const partner = await User.findOne({
      videoKycRoomId: roomId,
      role: "partner",
    });
    if (!partner) {
      return Response.json(
        {
          success: false,
          message: "Partner not found",
        },
        { status: 400 },
      );
    }
    if (action === "approved") {
      partner.videoKycStatus = "approved";
      partner.videoKycRejectionReason = undefined;
      partner.partnerOnBoardingSteps = 5;
    }
    if (action === "rejected") {
      if (!reason) {
        return Response.json(
          {
            success: false,
            message: "Rejection Reason is Required",
          },
          { status: 400 },
        );
      }
      partner.videoKycStatus = "rejected";
      partner.videoKycRejectionReason = reason.trim();

    }
    await partner.save()

    return Response.json(
        {
         status:partner.videoKycStatus
        },
        { status: 200 },
      );
  } catch (error) {
    return Response.json(
        {
          success: false,
          message: `KYC complete ${error}`,
        },
        { status: 500 },
      );
  }
}
