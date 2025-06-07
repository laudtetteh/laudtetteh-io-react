import { useEffect } from "react";
import { useRouter } from "next/router";

export default function UseAuthRedirect() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      const encodedPath = encodeURIComponent(router.asPath);
      router.replace(`/admin/login?redirect-to=${encodedPath}`);
    }
  }, [router]);
}
