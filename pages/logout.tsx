import { useEffect } from "react";
import { useFlashMessage } from "@/lib/useFlashMessage";

export default function LogoutPage() {
  const { redirectWithMessage } = useFlashMessage();

  useEffect(() => {
    localStorage.removeItem("token");
    redirectWithMessage('/admin/login', "Logged out successfully", "top-center", "replace", "success");
  }, []);

  return null;
}
