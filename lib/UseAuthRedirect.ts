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
      const token = localStorage.getItem("token");

      if (!token) {
        const encodedPath = encodeURIComponent(router.asPath);
        router.replace(`/admin/login?redirect-to=${encodedPath}`);
        return;
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BROWSER}/api/admin/session`,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        if (response.status === 401) {
          localStorage.removeItem("token");
          const encodedPath = encodeURIComponent(router.asPath);
          router.replace(`/admin/login?redirect-to=${encodedPath}`);
          return;
        }

        // Keep the page available for transient API failures; protected requests
        // still handle their own errors, while invalid credentials are redirected.
        setIsChecking(false);
      } catch {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [router]);

  return isChecking;
}
