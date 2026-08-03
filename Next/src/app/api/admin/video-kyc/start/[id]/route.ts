import { auth } from "@/auth";
import connectDb from "@/lib/db";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req:NextRequest,
    context:{params:Promise<{id:string}>}
){
    
    try{
        const session = await auth();
        
            if (!session || !session.user?.email || session.user.role !== "admin") {
              return Response.json({ message: "Unauthorized" }, { status: 401 });
            }
        
            await connectDb();
        
            const { id: partnerId } = await context.params;
            const partner = await User.findById(partnerId);
        
            if (!partner || partner.role !== "partner") {
              return Response.json({ message: "Partner not found" }, { status: 404 });
            }

            const roomId = partner.videoKycRoomId || `kyc-${partner._id}-${Date.now()}`;
            partner.videoKycRoomId=roomId
            partner.videoKycStatus="in_progress"
            partner.partnerOnBoardingSteps=4

            await partner.save()

            return NextResponse.json({
              roomId,
              partner: {
                _id: partner._id,
                name: partner.name,
                email: partner.email,
                videoKycStatus: partner.videoKycStatus,
              },
            })
    }
    catch {
        return NextResponse.json({message:"Video KYC Start error"},{status:500})
    }
}
