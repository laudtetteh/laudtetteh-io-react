import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import classNames from "classnames";

const FlashMessage = () => {
  const [message, setMessage] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  useEffect(() => {
    const showFlashMessage = () => {
      const msg = sessionStorage.getItem("flashMessage");
      if (msg) {
        setMessage(msg);
        setVisible(true);
        sessionStorage.removeItem("flashMessage");

        // Dismiss after 3 seconds
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          setVisible(false);
        }, 3000);
      }
    };

    showFlashMessage();

    router.events.on("routeChangeComplete", showFlashMessage);
    return () => {
      router.events.off("routeChangeComplete", showFlashMessage);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [router.events]);

  if (!message || !visible) return null;

  const isSuccess = message.startsWith("✅");
  const isError = message.startsWith("❌");

  return (
    <div
      className={classNames(
        "fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded shadow-lg text-white z-50 transition-opacity duration-500",
        {
          "bg-green-600": isSuccess,
          "bg-red-600": isError,
          "opacity-0": !visible,
          "opacity-100": visible,
        }
      )}
    >
      {message}
    </div>
  );
};

export default FlashMessage;
