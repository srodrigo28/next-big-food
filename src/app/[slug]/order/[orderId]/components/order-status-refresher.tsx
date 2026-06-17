"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const OrderStatusRefresher = () => {
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh();
    }, 8000);
    return () => clearInterval(interval);
  }, [router]);

  return null;
};
