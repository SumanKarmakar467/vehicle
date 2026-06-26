import { auth } from "@/auth";
import connectDb from "@/lib/db";
import PartnerBank from "@/models/partnerBank.model";
import PartnerDocs from "@/models/partnerDocs.model";
import User from "@/models/user.model";
import Vehicle from "@/models/vehicle.model";
import { NextResponse } from "next/server";

export async function GET() {
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
    const reviewCandidateUsers = await User.find({
      role: "partner",
      partnerOnBoardingSteps: {$gte:3},
    });

    const pendingKyc = await User.find({
      role: "partner",
      partnerStatus: "approved",
      $or: [
        { videoKycStatus: { $in: ["not_required", "pending", "in_progress"] } },
        { videoKycStatus: { $exists: false } },
        { videoKycStatus: null },
      ],
    });

    const partnerIds = reviewCandidateUsers.map((p) => p._id);

    const [partnerVehicles, partnerDocs, partnerBanks] = await Promise.all([
      Vehicle.find({
        owner: { $in: partnerIds },
      }),
      PartnerDocs.find({
        owner: { $in: partnerIds },
      }).sort({ updatedAt: -1 }),
      PartnerBank.find({
        owner: { $in: partnerIds },
      }),
    ]);

    const vehicleTypeMap = new Map(
      partnerVehicles.map((v) => [String(v.owner), v.type]),
    );
    const vehicleStatusMap = new Map(
      partnerVehicles.map((v) => [String(v.owner), v.status]),
    );
    const docsStatusMap = new Map<string, string>();
    partnerDocs.forEach((doc) => {
      const ownerId = String(doc.owner);
      if (!docsStatusMap.has(ownerId)) {
        docsStatusMap.set(ownerId, doc.status);
      }
    });
    const bankStatusMap = new Map(
      partnerBanks.map((bank) => [String(bank.owner), bank.status]),
    );

    const pendingPartnersReviews = reviewCandidateUsers
      .filter((p) => {
        const ownerId = String(p._id);

        return (
          p.partnerStatus === "pending" ||
          (p.partnerStatus === "approved" &&
            (vehicleStatusMap.get(ownerId) !== "approved" ||
              docsStatusMap.get(ownerId) !== "approved" ||
              bankStatusMap.get(ownerId) !== "verified"))
        );
      })
      .map((p) => ({
        _id: p._id,
        name: p.name,
        email: p.email,
        vehicleType: vehicleTypeMap.get(String(p._id)) || "N/A",
      }));

    const vehicleReviews = await Vehicle.find({ status: "pending" }).populate(
      "owner",
      "name email",
    );

    return NextResponse.json(
      {
        stats: {
          totalPartners,
          totalApprovedPartners,
          totalPendingPartners,
          totalRejectedPartners,
        },
        pendingPartnersReviews,
        pendingKyc,
        vehicleReviews,
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
