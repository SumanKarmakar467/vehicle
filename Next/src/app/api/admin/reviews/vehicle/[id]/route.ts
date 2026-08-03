import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Vehicle from "@/models/vehicle.model";
import { NextRequest } from "next/server";

export async function GET(
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
    const vehicle = await Vehicle.findById(id).populate(
      "owner",
      "name email role",
    );

    if (!vehicle) {
      return Response.json({ message: "Vehicle not found" }, { status: 404 });
    }

    const owner = vehicle.owner as unknown as { role?: string } | null;
    if (!owner || owner.role !== "partner") {
      return Response.json(
        { message: "Vehicle owner is not a valid partner" },
        { status: 404 },
      );
    }

    return Response.json({ vehicle }, { status: 200 });
  } catch (error) {
    return Response.json(
      { message: `Vehicle review error ${error}` },
      { status: 500 },
    );
  }
}
