import { useCallback, useEffect } from "react";

const useBeforeUnload = (
  enabled: boolean | (() => boolean) = true,
  message?: string
) => {
  const handler = useCallback(
    (event: BeforeUnloadEvent) => {
      const isEnabled = typeof enabled === "function" ? enabled() : enabled;

      if (!isEnabled) {
        return;
      }

      event.preventDefault();

      if (message) {
        event.returnValue = message;
      }

      return message;
    },
    [enabled, message]
  );

  useEffect(() => {
    if (!enabled) {
      return;
    }

    window?.addEventListener("beforeunload", handler);
    return () => window?.removeEventListener("beforeunload", handler);
  }, [enabled, handler]);
};

export default useBeforeUnload;
