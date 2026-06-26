import { auth } from "@/auth";
import {uploadOnCloudinary} from "@/lib/cloudinary";
import connectDb from "@/lib/db";
import PartnerDocs from "@/models/partnerDocs.model";
import User from "@/models/user.model";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();

    const session = await auth();

    if (!session?.user?.email) {
      return Response.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    const user = await User.findOne({
      email: session.user.email,
    });

    if (!user) {
      return Response.json(
        {
          message: "User not found",
        },
        {
          status: 404,
        },
      );
    }

    const existingDocs = await PartnerDocs.findOne({ owner: user._id }).sort({
      updatedAt: -1,
    });
    const formData = await req.formData();

    const aadhar = formData.get("aadhar") as Blob | null;
    const license = formData.get("license") as Blob | null;
    const rc = formData.get("rc") as Blob | null;

    if (!existingDocs && (!aadhar || !license || !rc)) {
      return Response.json(
        {
          message: "All documents are required",
        },
        {
          status: 400,
        },
      );
    }

    const aadharUrl = aadhar
      ? await uploadOnCloudinary(aadhar)
      : existingDocs?.aadharUrl;
    const licenseUrl = license
      ? await uploadOnCloudinary(license)
      : existingDocs?.licenseUrl;
    const rcUrl = rc ? await uploadOnCloudinary(rc) : existingDocs?.rcUrl;

    if (!aadharUrl || !licenseUrl || !rcUrl) {
      return Response.json(
        {
          message: "Failed to upload documents",
        },
        {
          status: 500,
        },
      );
    }

    const partnerDocs = await PartnerDocs.findOneAndUpdate(
      { owner: user._id },
      {
        owner: user._id,
        aadharUrl,
        licenseUrl,
        rcUrl,
        status: "pending",
        rejectionReason: undefined,
      },
      { upsert: true, new: true, sort: { updatedAt: -1 } },
    );
    if(user.partnerOnBoardingSteps<2){
      user.partnerOnBoardingSteps=2
    }else{
      user.partnerOnBoardingSteps=3
    }
    user.partnerStatus="pending"
    await user.save()

    return Response.json(
      {
        success: true,
        message: "Documents uploaded successfully",
        partnerDocs,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("Partner docs error:", error);

    return Response.json(
      {
        message: "Internal Server Error",
      },
      {
        status: 500,
      },
    );
  }
}

export async function GET() {
  try {
    await connectDb();

    const session = await auth();

    if (!session?.user?.email) {
      return Response.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    const user = await User.findOne({
      email: session.user.email,
    });

    if (!user) {
      return Response.json(
        {
          message: "User not found",
        },
        {
          status: 404,
        },
      );
    }

    const partnerDocs = await PartnerDocs.findOne({
      owner: user._id,
    }).sort({ updatedAt: -1 });

    if (!partnerDocs) {
      return Response.json(
        {
          message: "Partner documents not found",
        },
        {
          status: 404,
        },
      );
    }

    return Response.json({ partnerDocs }, { status: 200 });
  } catch (error) {
    console.error("Get partner docs error:", error);

    return Response.json(
      {
        message: `Get partner docs error: ${error}`,
      },
      {
        status: 500,
      },
    );
  }
}
