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
          user:mongoose.Types.ObjectId
          driver:mongoose.Types.ObjectId
          vehicle:mongoose.Types.ObjectId
      
          pickUpAddress:string
          dropAddress:string
      
          pickUpLocation:{
              type:"Point",
              coordinates:[number, number]
          }
          dropLocation:{
              type:"Point",
              coordinates:[number, number]
          }
          fare:number
          userMobileNumber:string
          driverMobileNumber:string
      
          bookingStatus:BookingStatus
    });
  } catch (error) {}
}
