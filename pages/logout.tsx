import { useEffect } from "react";
import { useRouter } from "next/router";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    localStorage.removeItem("token");
    sessionStorage.setItem("flashMessage", "✅ You’ve been logged out.");
    router.replace("/admin/login");
  }, [router]);

  return <p className="p-6">Logging you out...</p>;
}
