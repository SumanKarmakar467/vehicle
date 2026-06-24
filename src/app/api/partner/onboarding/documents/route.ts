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

    const formData = await req.formData();

    const aadhar = formData.get("aadhar") as Blob | null;
    const license = formData.get("license") as Blob | null;
    const rc = formData.get("rc") as Blob | null;

    if (!aadhar || !license || !rc) {
      return Response.json(
        {
          message: "All documents are required",
        },
        {
          status: 400,
        },
      );
    }

    const aadharUrl = await uploadOnCloudinary(aadhar);
    const licenseUrl = await uploadOnCloudinary(license);
    const rcUrl = await uploadOnCloudinary(rc);


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

    await PartnerDocs.create({
      owner: user._id,
      aadharUrl,
      licenseUrl,
      rcUrl,
    });
    if(user.partnerOnBoardingSteps<2){
      user.partnerOnBoardingSteps=2
    }else{
      user.partnerOnBoardingSteps=3
    }
    user.partnerStatus="pending"

    return Response.json(
      {
        success: true,
        message: "Documents uploaded successfully",
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
