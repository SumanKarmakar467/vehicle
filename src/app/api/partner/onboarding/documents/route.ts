import { auth } from "@/auth";
import connectDb from "@/lib/db";
import { updateOnCloudinary } from "@/lib/cloudinary";
import PartnerDocs from "@/models/partnerDocs.model";
import User from "@/models/user.model";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();

    const session = await auth();

    if (!session?.user?.email) {
      return Response.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await User.findOne({
      email: session.user.email,
    });

    if (!user) {
      return Response.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    const formData = await req.formData();

    const aadhar = formData.get("aadhar") as Blob | null;
    const license = formData.get("license") as Blob | null;
    const rc = formData.get("rc") as Blob | null;

    if (!aadhar || !license || !rc) {
      return Response.json(
        { message: "All documents are required" },
        { status: 400 }
      );
    }

    const updatePayload: Record<string, any> = {
      owner: user._id,
      status: "pending",
    };

    const aadharUrl = await updateOnCloudinary(aadhar);

    if (!aadharUrl) {
      return Response.json(
        { message: "Aadhar upload failed" },
        { status: 500 }
      );
    }

    updatePayload.aadharUrl = aadharUrl;

    const licenseUrl = await updateOnCloudinary(license);

    if (!licenseUrl) {
      return Response.json(
        { message: "License upload failed" },
        { status: 500 }
      );
    }

    updatePayload.licenseUrl = licenseUrl;

    const rcUrl = await updateOnCloudinary(rc);

    if (!rcUrl) {
      return Response.json(
        { message: "RC upload failed" },
        { status: 500 }
      );
    }

    updatePayload.rcUrl = rcUrl;

    const partnerDoc = await PartnerDocs.findOneAndUpdate(
      { owner: user._id },
      { $set: updatePayload },
      {
        upsert: true,
        new: true,
      }
    );

    if (user.partnerOnBoardingSteps < 2) {
      user.partnerOnBoardingSteps = 2;
      await user.save();
    }

    return Response.json(partnerDoc, {
      status: 201,
    });
  } catch (error) {
    console.error("Partner docs error:", error);

    return Response.json(
      {
        message: `Partner docs error: ${error}`,
      },
      {
        status: 500,
      }
    );
  }
}