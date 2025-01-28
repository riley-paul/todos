import { useIsMobile } from "@/hooks/use-is-mobile";
import { Portal, Spinner } from "@radix-ui/themes";
import React from "react";
import { Toaster } from "sonner";
import { useDarkMode } from "usehooks-ts";
import RadixProvider from "../radix-provider";

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
            success: <i className="fa-solid fa-circle-check text-green-10" />,
            error: (
              <i className="fa-solid fa-exclamation-triangle text-red-10" />
            ),
            info: <i className="fa-solid fa-circle-info" />,
          }}
        />
      </RadixProvider>
    </Portal>
  );
};

export default CustomToaster;
