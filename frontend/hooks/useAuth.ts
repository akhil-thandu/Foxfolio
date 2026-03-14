"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { silentRefresh } from "@/lib/auth";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function init() {
      const hasToken = typeof window !== "undefined" && !!(window as any).__accessToken;
      if (hasToken) {
        setIsAuthenticated(true);
        setIsLoading(false);
        return;
      }
      const token = await silentRefresh();
      if (token) {
        setIsAuthenticated(true);
      } else {
        router.push("/login");
      }
      setIsLoading(false);
    }
    init();
  }, [router]);

  return { isAuthenticated, isLoading };
}
