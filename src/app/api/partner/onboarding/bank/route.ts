import { auth } from "@/auth";
import connectDb from "@/lib/db";
import PartnerBank from "@/models/partnerBank.model";
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

    const {
      accountHolder,
      accountNumber,
      upi,
      ifsc,
      mobileNumber,
    } = await req.json();

    if (
      !accountHolder ||
      !accountNumber ||
      !ifsc ||
      !mobileNumber
    ) {
      return Response.json(
        { message: "Send all bank details" },
        { status: 400 }
      );
    }

    const partnerBank = await PartnerBank.findOneAndUpdate(
      {
        owner: user._id,
      },
      {
        owner: user._id,
        accountHolder,
        accountNumber,
        ifsc,
        upi,
        status: "added",
      },
      {
        upsert: true,
        new: true,
      }
    );

    user.mobileNumber = mobileNumber;

    if (user.partnerOnBoardingSteps < 3) {
      user.partnerOnBoardingSteps = 3;
    }

    await user.save();

    return Response.json(
      {
        partnerBank,
        mobileNumber: user.mobileNumber,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Partner bank error:", error);

    return Response.json(
      {
        message: `Partner bank error: ${error}`,
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET() {
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

    const partnerBank = await PartnerBank.findOne({
      owner: user._id,
    });

    if (!partnerBank) {
      return Response.json(
        { message: "Partner bank details not found" },
        { status: 404 }
      );
    }

    return Response.json(
      {
        partnerBank,
        mobileNumber: user.mobileNumber,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Get partner bank error:", error);

    return Response.json(
      {
        message: `Get partner bank error: ${error}`,
      },
      {
        status: 500,
      }
    );
  }
}