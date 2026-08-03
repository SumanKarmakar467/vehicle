import PartnerBank from "@/models/partnerBank.model";
import { auth } from "@/auth";
import connectDb from "@/lib/db";
import PartnerDocs from "@/models/partnerDocs.model";
import User from "@/models/user.model";
import { NextRequest } from "next/server";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (
      !session ||
      !session.user?.email ||
      session.user.role !== "admin"
    ) {
      return Response.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDb();
    const {rejectionReason}=await req.json()

    const { id: partnerId } = await context.params;

    const partner = await User.findById(partnerId);

    if (!partner || partner.role !== "partner") {
      return Response.json(
        { message: "Partner not found" },
        { status: 404 }
      );
    }

    const partnerDocs=await PartnerDocs.findOne({owner:partner._id})
    const partnerBank=await PartnerBank.findOne({owner:partner._id})

    if(!partnerDocs || !partnerBank){
        return Response.json(
        { message: "Partner did not complete on boarding steps" },
        { status: 400 }
      );
    }
    partner.partnerStatus="rejected"
    partner.rejectionReason=rejectionReason
    await partner.save()

    return Response.json(
      {
        success: true,
        message:"Partner rejected successfully",
        partner,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Partner Rejected Error:", error);

    return Response.json(
      {
        success: false,
        message: `Partner rejected error ${error}`,
      },
      { status: 500 }
    );
  }
}