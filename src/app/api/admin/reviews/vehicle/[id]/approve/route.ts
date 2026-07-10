import { auth } from "@/auth";
import connectDb from "@/lib/db";
import User from "@/models/user.model";
import Vehicle from "@/models/vehicle.model";
import { NextRequest } from "next/server";

export async function POST(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();

    if (!session || !session.user?.email || session.user.role !== "admin") {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDb();

    const { id } = await context.params;
    const vehicle = await Vehicle.findById(id);

    if (!vehicle) {
      return Response.json({ message: "Vehicle not found" }, { status: 404 });
    }

    vehicle.status = "approved";
    vehicle.rejectionReason = undefined;
    await vehicle.save();

    await User.findByIdAndUpdate(vehicle.owner, {
      partnerOnBoardingSteps: 7,
    });

    return Response.json(
      { success: true, message: "Vehicle pricing approved", vehicle },
      { status: 200 },
    );
  } catch (error) {
    return Response.json(
      { success: false, message: `Vehicle approve error ${error}` },
      { status: 500 },
    );
  }
}
