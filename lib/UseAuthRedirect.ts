import { useEffect, useState } from "react";
import { useRouter } from "next/router";

/**
 * Client-side auth gate for admin pages backed by a localStorage JWT.
 * Redirects to /admin/login when no token is present, and returns
 * `isChecking` so callers can withhold rendering protected UI (dashboard
 * chrome, data, controls) until the check has completed.
 */
export default function UseAuthRedirect(): boolean {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      // Small delay to allow localStorage to be updated
      await new Promise(resolve => setTimeout(resolve, 50));

      const token = localStorage.getItem("token");

      if (!token) {
        const encodedPath = encodeURIComponent(router.asPath);
        router.replace(`/admin/login?redirect-to=${encodedPath}`);
      } else {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [router]);

  return isChecking;
}
