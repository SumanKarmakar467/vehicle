import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Vehicle from "@/models/vehicle.model";
import { NextRequest } from "next/server";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();

    if (!session || !session.user?.email || session.user.role !== "admin") {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDb();

    const { rejectionReason } = await req.json();
    const reason = String(rejectionReason ?? "").trim();

    if (!reason) {
      return Response.json(
        { message: "Rejection reason is required" },
        { status: 400 },
      );
    }

    const { id } = await context.params;
    const vehicle = await Vehicle.findById(id);

    if (!vehicle) {
      return Response.json({ message: "Vehicle not found" }, { status: 404 });
    }

    vehicle.status = "rejected";
    vehicle.rejectionReason = reason;
    await vehicle.save();

    return Response.json(
      { success: true, message: "Vehicle pricing rejected", vehicle },
      { status: 200 },
    );
  } catch (error) {
    return Response.json(
      { success: false, message: `Vehicle reject error ${error}` },
      { status: 500 },
    );
  }
}
