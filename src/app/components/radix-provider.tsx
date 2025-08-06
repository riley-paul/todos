import { useIsMobile } from "@/app/hooks/use-is-mobile";
import { Theme } from "@radix-ui/themes";
import React from "react";
import { useAppearance } from "../hooks/use-theme";

const RadixProvider = React.forwardRef<HTMLDivElement, React.PropsWithChildren>(
  ({ children }, ref) => {
    const appearance = useAppearance();
    const isMobile = useIsMobile();

    return (
      <Theme
        ref={ref}
        appearance={appearance}
        accentColor="teal"
        grayColor="gray"
        radius="large"
        scaling={isMobile ? "105%" : "100%"}
      >
        {children}
      </Theme>
    );
  },
);

export default RadixProvider;
