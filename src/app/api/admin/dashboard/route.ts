import { auth } from "@/auth";
import connectDb from "@/lib/db";
import User from "@/models/user.model";
import Vehicle from "@/models/vehicle.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDb();
    const session = await auth();
    if (!session || !session.user?.email || session.user.role !== "admin") {
      return Response.json({ message: "unauthorized" }, { status: 400 });
    }
    const totalPartners = await User.countDocuments({ role: "partner" });
    const totalApprovedPartners = await User.countDocuments({
      role: "partner",
      partnerStatus: "approved",
    });
    const totalPendingPartners = await User.countDocuments({
      role: "partner",
      partnerStatus: "pending",
    });
    const totalRejectedPartners = await User.countDocuments({
      role: "partner",
      partnerStatus: "rejected",
    });
    const allPartners = await User.find({ role: "partner" });

console.log("ALL PARTNERS:", allPartners);

   const pendingPartnerUsers = await User.find({
  partnerOnBoardingSteps: 3,
});

console.log("TEST:", pendingPartnerUsers);

    const partnerIds = pendingPartnerUsers.map((p) => p._id);

    const partnerVehicles = await Vehicle.find({
      owner: { $in: partnerIds },
    });

    const vehicleTypeMap = new Map(
      partnerVehicles.map((v) => [String(v.owner), v.type]),
    );

    const pendingPartnersReviews = pendingPartnerUsers.map((p) => ({
      _id: p._id,
      name: p.name,
      email: p.email,
      vehicleType: vehicleTypeMap.get(String(p._id)) || "N/A",
    }));

    console.log("Pending Partner Users:", pendingPartnerUsers);
console.log("Partner Reviews:", pendingPartnersReviews);
    return NextResponse.json(
      {
        stats: {
          totalPartners,
          totalApprovedPartners,
          totalPendingPartners,
          totalRejectedPartners,
        },
        pendingPartnersReviews,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: `admin dashboard error ${error}` },
      { status: 500 },
    );
  }
}
