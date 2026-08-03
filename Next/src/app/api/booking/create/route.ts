import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Booking from "@/models/booking.model";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "unauthorize" }, { status: 400 });
    }
    const {
      driverId,
      vehicleId,
      pickupAddress,
      dropAddress,
      pickupLocation,
      dropLocation,
      fare,
      mobileNumber,
    } = await req.json();

    if (
      !driverId ||
      !vehicleId ||
      !pickupLocation.coordinates ||
      !dropLocation.coordinates
    ) {
      return NextResponse.json(
        { message: "missing required details" },
        { status: 400 },
      );
    }

    const driver = await User.findById(driverId);
    if (!driver) {
      return NextResponse.json(
        { message: "driver is not found" },
        { status: 400 },
      );
    }

    const existing = await Booking.findOne({
      user: session.user.id,
      status: {
        $in: ["requested", "awaiting_payment", "confirmed", "started"],
      },
    });
    if (existing) {
      return NextResponse.json(existing);
    }
    const booking = await Booking.create({
      user: session.user.id,
      driver: driverId,
      vehicle: vehicleId,

      pickUpAddress: pickupAddress,
      dropAddress: dropAddress,

      pickUpLocation: pickupLocation,
      dropLocation: dropLocation,

      fare,
      userMobileNumber: mobileNumber,
      driverMobileNumber: driver.mobileNumber,

      bookingStatus: "requested",
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "something went wrong" },
      { status: 500 },
    );
  }
}
