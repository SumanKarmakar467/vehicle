import { auth } from "@/auth";
import connectDb from "@/lib/db";
import User from "@/models/user.model";

export async function GET() {
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
        { status: 403 }
      );
    }

    // Get partners waiting for Video KYC
    const partners = await User.find({
      role: "partner",
      partnerStatus: "approved",
      partnerOnBoardingSteps: 4,
      $or: [
        { videoKycStatus: { $in: ["not_required", "pending", "in_progress"] } },
        { videoKycStatus: { $exists: false } },
        { videoKycStatus: null },
      ],
    }).select("-password");

    return Response.json(
      {
        success: true,
        count: partners.length,
        data: partners,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Partner KYC GET Error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to fetch partner KYC list.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}