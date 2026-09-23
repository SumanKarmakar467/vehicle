"use client";

import { useSession } from "next-auth/react";
import useGetMe from "./hooks/useGetMe";

function InitUser() {
  const { status } = useSession();

  useGetMe(status === "authenticated");

  return nll;
}

export default InitUser;