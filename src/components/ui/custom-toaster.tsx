import { useIsMobile } from "@/hooks/use-is-mobile";
import { Portal, Spinner } from "@radix-ui/themes";
import React from "react";
import { Toaster } from "sonner";
import { useDarkMode } from "usehooks-ts";
import RadixProvider from "../radix-provider";
import { CircleCheckIcon, TriangleAlertIcon, InfoIcon } from "lucide-react";

const CustomToaster: React.FC = () => {
  const { isDarkMode } = useDarkMode();
  const isMobile = useIsMobile();
  return (
    <Portal>
      <RadixProvider>
        <Toaster
          theme={isDarkMode ? "dark" : "light"}
          toastOptions={{
            className: "bg-panel backdrop-blur border border-gray-6",
          }}
          position={isMobile ? "top-center" : "bottom-center"}
          icons={{
            loading: <Spinner />,
            success: <CircleCheckIcon className="size-4 text-green-10" />,
            error: <TriangleAlertIcon className="size-4 text-red-10" />,
            info: <InfoIcon className="size-4" />,
          }}
        />
      </RadixProvider>
    </Portal>
  );
};

export default CustomToaster;
