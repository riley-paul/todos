import { useAppearance } from "@/app/hooks/use-theme";
import { Portal, Spinner } from "@radix-ui/themes";
import React from "react";
import { Toaster } from "sonner";
import RadixProvider from "@/app/providers/radix-provider";
import { CircleCheckIcon, TriangleAlertIcon, InfoIcon } from "lucide-react";
import { useIsMobile } from "@/app/hooks/use-is-mobile";

const CustomToaster: React.FC = () => {
  const appearance = useAppearance();
  const isMobile = useIsMobile();
  return (
    <Portal>
      <RadixProvider>
        <Toaster
          theme={appearance}
          toastOptions={{
            className: "bg-panel-solid border border-gray-6 rounded-4",
          }}
          position={isMobile ? "top-center" : "bottom-center"}
          icons={{
            loading: <Spinner />,
            success: <CircleCheckIcon className="text-green-10 size-4" />,
            error: <TriangleAlertIcon className="text-red-10 size-4" />,
            info: <InfoIcon className="size-4" />,
          }}
        />
      </RadixProvider>
    </Portal>
  );
};

export default CustomToaster;
