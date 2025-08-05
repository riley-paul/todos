import { useIsMobile } from "@/app/hooks/use-is-mobile";
import { Theme } from "@radix-ui/themes";
import React from "react";
import { useDarkMode } from "usehooks-ts";

const RadixProvider = React.forwardRef<HTMLDivElement, React.PropsWithChildren>(
  ({ children }, ref) => {
    const { isDarkMode } = useDarkMode({ defaultValue: true });
    const isMobile = useIsMobile();

    return (
      <Theme
        ref={ref}
        appearance={isDarkMode ? "dark" : "light"}
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
