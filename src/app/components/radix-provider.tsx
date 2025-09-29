import { useIsMobile } from "@/app/hooks/use-is-mobile";
import { Theme, type ThemeProps } from "@radix-ui/themes";
import React from "react";
import { useAppearance } from "../hooks/use-theme";

const RadixProvider: React.FC<ThemeProps> = (props) => {
  const appearance = useAppearance();
  const isMobile = useIsMobile();

  return (
    <Theme
      appearance={appearance}
      accentColor="teal"
      grayColor="gray"
      radius="large"
      scaling={isMobile ? "105%" : "100%"}
      {...props}
    />
  );
};

export default RadixProvider;
