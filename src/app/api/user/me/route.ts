import { auth } from "@/auth";
import connectDb from "@/lib/db";
import User from "@/models/user.model"; 

export async function GET(req: Request) {
  try {
    await connectDb();

    const session = await auth();

    if (!session || !session.user || !session.user.email) {
      return Response.json(
        {
          success: false,
          message: "User is not authenticated",
        },
        {
          status: 401,
        }
      );
    }

    const user = await User.findOne({
      email: session.user.email,
    }).select("-password");

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    return Response.json(
      {
        success: true,
        user,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("GET User Error:", error);

    return Response.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}