"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { motion } from "motion/react";
import { Check, Clock, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import RejectionCard from "./RejectionCard";
import StatusCard from "./StatusCard";

type Step = {
  id: number;
  title: string;
  route?: string;
};

const STEPS: Step[] = [
  { id: 1, title: "Vehicle", route: "/partner/onboarding/vehicle" },
  { id: 2, title: "Documents", route: "/partner/onboarding/documents" },
  { id: 3, title: "Bank", route: "/partner/onboarding/bank" },
  { id: 4, title: "Review" },
  { id: 5, title: "Video KYC" },
  { id: 6, title: "Pricing" },
  { id: 7, title: "Final Review" },
  { id: 8, title: "Live" },
];

const TOTAL_STEPS = STEPS.length;

function PartnerDashboard() {
  const [activeStep, setActiveStep] = useState(1);
  const router=useRouter()
  const { userData } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (userData?.partnerOnBoardingSteps) {
      setActiveStep(userData.partnerOnBoardingSteps + 1);
    }
  }, [userData]);

  const goToStep=(step:Step)=>{
    if(step.route && step.id<=activeStep){
        router.push(step.route)
    }
  }

  const progressPercentage = ((activeStep - 1) / (TOTAL_STEPS - 1)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 px-4 pt-28 pb-20">
      <div className="max-w-7xl mx-auto space-y-16">
        <div>
          <h1 className="text-4xl font-bold">Partner Onboarding</h1>

          <p className="text-gray-600 mt-3">
            Complete all steps to activate your account
          </p>
        </div>

        <div className="bg-white rounded-3xl p-10 shadow-xl border overflow-x-auto">
          <div className="relative min-w-[800px]">
            {/* Background Line */}
            <div className="absolute top-7 left-0 w-full h-[3px] bg-gray-200 rounded-full" />

            {/* Progress Line */}
            <motion.div
              animate={{
                width: `${progressPercentage}%`,
              }}
              transition={{ duration: 0.6 }}
              className="absolute top-7 left-0 h-[3px] bg-black rounded-full"
            />

            {/* Steps */}
            <div className="relative flex justify-between">
              {STEPS.map((s) => {
                const completed = s.id < activeStep;
                const active = s.id === activeStep;
                const locked = s.id > activeStep;

                return (
                  <motion.div
                    key={s.id}
                    whileHover={!locked ? { scale: 1.1 } : {}}
                    onClick={()=>goToStep(s)}
                    className="flex flex-col items-center z-10 cursor-pointer"
                  >
                    <div
                      className={`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all
    ${
      completed
        ? "bg-black text-white border-black"
        : active
          ? "border-black bg-white text-black"
          : "border-gray-300 text-gray-400 bg-white"
    }`}
                    >
                      {completed ? (
                        <Check size={20} />
                      ) : locked ? (
                        <Lock size={20} />
                      ) : (
                        s.id
                      )}
                    </div>
                    <p className="mt-3 text-sm font-semibold text-center">{s.title}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {
          activeStep===4 && userData?.partnerStatus==='rejected' && (
            <RejectionCard
            title="Partner Rejected"
            reason={userData.rejectionReason}
            actionLabel={'Review and Update'}
            onAction={() => {
              router.push("/partner/onboarding/vehicle")
            }}
            />
          )
        }

        {
          activeStep===4 && userData?.partnerStatus==='pending' && (
            <StatusCard
            icon={<Clock size={18}/>}
            title={"Documents Under Review"}
            description={"Admin is Verifying your documents."}
            />
          )

        }
      </div>
    </div>
  );
}

export default PartnerDashboard;
