import { auth } from "@/auth";
import { uploadOnCloudinary } from "@/lib/cloudinary";
import connectDb from "@/lib/db";
import User from "@/models/user.model";
import Vehicle from "@/models/vehicle.model";
import { NextRequest } from "next/server";

export async function POST(prequest: NextRequest) {
  try {
    await connectDb();
    const session = await auth();

    if (!session || !session.user?.email) {
      return Response.json({ message: "unauthorized" }, { status: 400 });
    }

    const partner = await User.findOne({ email: session.user.email });

    if (!partner) {
      return Response.json({ message: "partner not found" }, { status: 400 });
    }
    // const {baseFare, pricePerKM, waitingCharge}=await req.json()
    const vehicle = await Vehicle.findOne({ owner: partner._id });
    if (!vehicle) {
      return Response.json(
        { message: "Vehicle not found. Please complete vehicle details first." },
        { status: 400 },
      );
    }

    const formData = await prequest.formData();
    const image = formData.get("image") as File | null;
    const baseFare = formData.get("baseFare");
    const pricePerKM = formData.get("pricePerKM");
    const waitingCharge = formData.get("waitingCharge");

    let updated = false;
    if (baseFare !== null && baseFare !== "") {
        const value = Number(baseFare);
        if (Number.isNaN(value)) {
          return Response.json({ message: "Invalid base fare" }, { status: 400 });
        }
        vehicle.baseFare = value;
        updated = true;
    }
    if (pricePerKM !== null && pricePerKM !== "") {
        const value = Number(pricePerKM);
        if (Number.isNaN(value)) {
          return Response.json({ message: "Invalid price per KM" }, { status: 400 });
        }
        vehicle.pricePerKM = value;
        updated = true;
    }
    if (waitingCharge !== null && waitingCharge !== "") {
        const value = Number(waitingCharge);
        if (Number.isNaN(value)) {
          return Response.json({ message: "Invalid waiting charge" }, { status: 400 });
        }
        vehicle.waitingCharge = value;
        updated = true;
    }

    if (image && image.size > 0) {
        const imageUrl = await uploadOnCloudinary(image);
        if (!imageUrl) {
            return Response.json(
              { message: "Vehicle image upload failed. Please try again." },
              { status: 500 },
            );
        }
        vehicle.imageUrl = imageUrl;
        updated = true;
    }

    if(updated === false){
        return Response.json({ message: "Nothing to update" }, { status: 400 });
    }

    vehicle.status="pending"
    vehicle.rejectionReason=undefined
    await vehicle.save()
    partner.partnerOnBoardingSteps=6
    await partner.save()

    return Response.json(
      { message: "Pricing Submitted", vehicle },
      { status: 200 },
    );


  } catch (error) {
    return Response.json({ message: `Pricing error ${error}` }, { status: 500 });

  }
}

export async function GET(){
  try{
    await connectDb();
    const session = await auth();

    if (!session || !session.user?.email) {
      return Response.json({ message: "unauthorized" }, { status: 400 });
    }

    const partner = await User.findOne({ email: session.user.email });

    if (!partner) {
      return Response.json({ message: "partner not found" }, { status: 400 });
    }
    // const {baseFare, pricePerKM, waitingCharge}=await req.json()
    const vehicle =await Vehicle.findOne({owner:partner._id})
    if (!vehicle) {
      return Response.json({ message: "Vehicle not found" }, { status: 400 });
    }
    return Response.json(vehicle , { status: 200 });

  }
  catch{
      return Response.json({ message: "Pricing error" }, { status: 500 });
  }
}
