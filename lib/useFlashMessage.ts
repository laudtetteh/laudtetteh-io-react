import { useRouter } from "next/router";

type FlashMessageType = "success" | "error" | "info" | "confirm";
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
  type?: FlashMessageType;
  action?: { label: string; onClick: () => void };
  confirmId?: string;
};

export function useFlashMessage() {
  const router = useRouter();

  const pushMessage = (
    message: string,
    position: FlashPosition = "top-center",
    type: FlashMessageType = "info"
  ) => {
    const existingRaw = sessionStorage.getItem("flashQueue");
    const existing: FlashItem[] = existingRaw ? JSON.parse(existingRaw) : [];
    existing.push({ message, position, type });
    sessionStorage.setItem("flashQueue", JSON.stringify(existing));
  };

  const redirectWithMessage = (
    url: string,
    message: string,
    position: FlashPosition = "top-center",
    method: "push" | "replace" = "push",
    type: FlashMessageType = "info"
  ) => {
    pushMessage(message, position, type);
    router[method](url);
  };

  const confirmPrompt = (message: string): Promise<boolean> => {
    const confirmId = `confirm-${Date.now()}-${Math.random().toString(36).slice(2)}`;

    return new Promise((resolve) => {
      // BroadcastChannel listener (only needed for *this* confirm)
      const channel = new BroadcastChannel("flashConfirm");
      channel.onmessage = (e) => {
        if (e.data?.id === confirmId) {
          channel.close();
          resolve(Boolean(e.data.result));
        }
      };

      // Add to confirm map in session
      const rawConfirmMap = sessionStorage.getItem("flashConfirm");
      const confirmMap = rawConfirmMap ? JSON.parse(rawConfirmMap) : {};
      confirmMap[confirmId] = true;
      sessionStorage.setItem("flashConfirm", JSON.stringify(confirmMap));

      // Add the confirmation message to the flash queue
      const confirmItem: FlashItem = {
        message,
        position: "top-center",
        type: "confirm",
        confirmId,
      };

      const rawQueue = sessionStorage.getItem("flashQueue");
      const queue: FlashItem[] = rawQueue ? JSON.parse(rawQueue) : [];
      queue.unshift(confirmItem); // show immediately
      sessionStorage.setItem("flashQueue", JSON.stringify(queue));
    });
  };

  return { pushMessage, redirectWithMessage, confirmPrompt };
} 