import { registerServiceWorker } from "@/register-sw";
import { useEffect } from "react";
import { toast } from "sonner";

export default function useServiceWorker() {
  useEffect(() => {
    registerServiceWorker(() => {
      toast.info(
        "A new version of the app is available. Please refresh to update.",
        {
          action: {
            label: "Refresh",
            onClick: () => {
              window.location.reload();
            },
          },
        },
      );
    });
  }, []);
}
