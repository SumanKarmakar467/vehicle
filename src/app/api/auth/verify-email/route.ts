import connectDb from "@/lib/db";
import { User } from "lucide-react";

export async function POST(req: Request) {
  try {
    await connectDb();
    const { email, otp } = await req.json();
    if (!email && !otp) {
      return Response.json(
        { message: "Email & OTP is required" },
        { status: 400 },
      );
    }
    const user = await User.findOne({ email });
    if (!user) {
      return Response.json({ message: "User Not Found" }, { status: 400 });
    }

    if (user.isEmailVerified) {
      return Response.json(
        { message: "Email is Already Verified" },
        { status: 400 },
      );
    }

    if (!user.otpExpiresAt || user.otpExpiresAt < new Date()) {
      return Response.json(
        { message: "OTP has been expired" },
        { status: 400 },
      );
    }

    if (!user.otp || user.otp != otp) {
      return Response.json({ message: "Invalid OTP" }, { status: 400 });
    }

    user.isEmailVerified = true;
    user.otp = undefined;
    user.otpExpiredAt = undefined;

    await user.save();
    return Response.json({ message: "Email is Verified" }, { status: 200 });
  } catch (error) {
    return Response.json(
      { message: "Verify Email Error ${error}" },
      { status: 500 },
    );
  }
}
