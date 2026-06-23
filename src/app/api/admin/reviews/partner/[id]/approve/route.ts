import { auth } from "@/auth";
import connectDb from "@/lib/db";
import User from "@/models/user.model";
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

    return Response.json(
      {
        success: true,
        partner,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Partner Review Error:", error);

    return Response.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}