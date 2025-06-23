import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function UseAuthRedirect() {
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

  // Show loading state while checking auth
  if (isChecking) {
    return null; // or a loading spinner
  }

  return null;
}
