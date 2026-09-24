"use client";

import { useSession } from "next-auth/react";
import useGetMe from "./hoos/useGetMe";

function InitUser() {
  const { status } = useSession();

  useGetMe(status === "authenticated");

  return null;
}

export default InitUser;