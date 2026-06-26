import { auth } from "@/auth";
import connectDb from "@/lib/db";
import PartnerBank from "@/models/partnerBank.model";
import PartnerDocs from "@/models/partnerDocs.model";
import User from "@/models/user.model";
import Vehicle from "@/models/vehicle.model";
import { NextRequest } from "next/server";

type RouteContext = { params: Promise<{ id: string }> };

async function approvePartner(context: RouteContext) {
  try {
    const session = await auth();

    if (!session || !session.user?.email || session.user.role !== "admin") {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDb();

    const { id: partnerId } = await context.params;
    const partner = await User.findById(partnerId);

    if (!partner || partner.role !== "partner") {
      return Response.json({ message: "Partner not found" }, { status: 404 });
    }

    const [partnerDocs, partnerBank, vehicle] = await Promise.all([
      PartnerDocs.findOne({ owner: partner._id }).sort({ updatedAt: -1 }),
      PartnerBank.findOne({ owner: partner._id }),
      Vehicle.findOne({ owner: partner._id }),
    ]);

    if (!partnerDocs || !partnerBank || !vehicle) {
      return Response.json(
        { message: "Partner did not complete onboarding steps" },
        { status: 400 },
      );
    }

    partner.partnerStatus = "approved";
    partner.rejectionReason = undefined;
    partner.videoKycStatus = "pending";
    partner.partnerOnBoardingSteps = Math.max(
      partner.partnerOnBoardingSteps ?? 0,
      4,
    );

    partnerDocs.status = "approved";
    partnerDocs.rejectionReason = undefined;
    partnerBank.upi = partnerBank.upi?.trim() || "N/A";
    partnerBank.status = "verified";
    vehicle.status = "approved";

    await Promise.all([
      partner.save(),
      partnerDocs.save(),
      partnerBank.save(),
      vehicle.save(),
    ]);

    return Response.json(
      {
        success: true,
        message: "Partner approved successfully",
        partner,
        partnerDocs,
        partnerBank,
        vehicle,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Partner Review Error:", error);

    return Response.json(
      {
        success: false,
        message: `Partner approved error ${error}`,
      },
      { status: 500 },
    );
  }
}

export async function POST(_req: NextRequest, context: RouteContext) {
  return approvePartner(context);
}

export async function GET(_req: NextRequest, context: RouteContext) {
  return approvePartner(context);
}
