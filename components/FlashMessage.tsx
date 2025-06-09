import { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { useRouter } from "next/router";

type FlashType = "success" | "error" | "info" | "confirm";
type FlashPosition =
  | "top-center"
  | "top-left"
  | "top-right"
  | "bottom-center"
  | "bottom-left"
  | "bottom-right";

type FlashItem = {
  message: string;
  position: FlashPosition;
  type?: FlashType;
  action?: { label: string; onClick: () => void };
  confirmId?: string;
};

const POSITIONS: Record<FlashPosition, string> = {
  "top-center": "top-4 left-1/2 -translate-x-1/2",
  "top-left": "top-4 left-4",
  "top-right": "top-4 right-4",
  "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
  "bottom-left": "bottom-4 left-4",
  "bottom-right": "bottom-4 right-4",
};

const ICONS: Record<FlashType, string> = {
  success: "✅",
  error: "❌",
  info: "ℹ️",
  confirm: "❓",
};

export default function FlashMessage() {
  const [queue, setQueue] = useState<FlashItem[]>([]);
  const [current, setCurrent] = useState<FlashItem | null>(null);
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  useEffect(() => {
    const showFlash = () => {
      const raw = sessionStorage.getItem("flashQueue");
      if (raw) {
        try {
          const msgs: FlashItem[] = JSON.parse(raw);
          setQueue((prev) => [...prev, ...msgs]);
        } catch (e) {
          console.error("Failed to parse flashQueue:", e);
        }
        sessionStorage.removeItem("flashQueue");
      }
    };

    showFlash();
    router.events.on("routeChangeComplete", showFlash);
    return () => router.events.off("routeChangeComplete", showFlash);
  }, [router.events]);

  useEffect(() => {
    if (!visible && queue.length > 0) {
      const [next, ...rest] = queue;
      setCurrent(next);
      setQueue(rest);
      setVisible(true);

      if (next.type !== "confirm") {
        timeoutRef.current = setTimeout(() => {
          handleClose();
        }, 3000);
      }
    }
  }, [queue, visible]);

  const handleClose = () => {
    setVisible(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setTimeout(() => setCurrent(null), 300);
  };

  const resolveConfirm = (value: boolean) => {
    if (!current?.confirmId) return;

    const channel = new BroadcastChannel("flashConfirm");
    channel.postMessage({ id: current.confirmId, result: value });
    channel.close();

    handleClose();
  };

  if (!current) return null;

  const { message, position, type = "info", action } = current;
  const icon = ICONS[type];

  const baseClasses = classNames(
    "fixed z-50 px-5 py-4 rounded shadow-md text-white transition-all duration-300 transform flex flex-col items-center justify-between gap-4 w-[90vw] max-w-sm",
    POSITIONS[position] || POSITIONS["top-center"],
    {
      "bg-green-600": type === "success",
      "bg-red-600": type === "error",
      "bg-blue-600": type === "info",
      "bg-yellow-600": type === "confirm",
      "opacity-0 scale-95 pointer-events-none": !visible,
      "opacity-100 scale-100": visible,
    }
  );

  return (
    <div role="alert" aria-live="assertive" className={baseClasses}>
      <div className="flex items-start gap-2 w-full">
        <span className="text-xl">{icon}</span>
        <span className="flex-1 text-left">{message}</span>
      </div>

      {type === "confirm" ? (
        <div className="flex gap-4 justify-end w-full pt-2">
          <button
            onClick={() => resolveConfirm(false)}
            className="bg-gray-300 text-gray-800 px-4 py-1 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={() => resolveConfirm(true)}
            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
          >
            OK
          </button>
        </div>
      ) : (
        <div className="flex justify-between items-center w-full pt-2">
          {action && (
            <button
              onClick={action.onClick}
              className="text-sm text-white underline hover:text-gray-200"
            >
              {action.label}
            </button>
          )}
          <button
            onClick={handleClose}
            className="ml-2 text-white hover:text-gray-300 text-lg leading-none"
            aria-label="Dismiss"
            title="Dismiss"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
