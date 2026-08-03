import { auth } from "@/auth";
import connectDb from "@/lib/db";
import PartnerDocs from "@/models/partnerDocs.model";
import PartnerBank from "@/models/partnerBank.model";
import User from "@/models/user.model";
import Vehicle from "@/models/vehicle.model";
import { NextRequest } from "next/server";

export async function GET(
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

    const { id: partnerId } = await context.params;

    const partner = await User.findById(partnerId);

    if (!partner || partner.role !== "partner") {
      return Response.json(
        { message: "Partner not found" },
        { status: 404 }
      );
    }

    const vehicle = await Vehicle.findOne({
      owner: partnerId,
    });

    const documents = await PartnerDocs.findOne({
      owner: partnerId,
    }).sort({ updatedAt: -1 });

    const bank = await PartnerBank.findOne({
      owner: partnerId,
    });

    return Response.json(
      {
        partner,
        vehicle: vehicle || null,
        documents: documents || null,
        bank: bank || null,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Partner Review Error:", error);

    return Response.json(
      {
        message: `Partner get error ${error}`,
      },
      {
        status: 500,
      }
    );
  }
}
