"use client";

import { setUserData } from "@/redux/userSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetMe = (enabled: boolean) => {
  const dispatch = useDispatch();
  useEffect(() => {
    if (!enabled) return;

    const getMe = async () => {
      try {
        const { data } = await axios.get("/api/user/me");
        dispatch(setUserData(data.user));
        console.log("USER DATA:" ,data)
      } catch (error) {
        console.error(error);
      }
    };

    getMe();
  }, [enabled]);
};

export default useGetMe;
