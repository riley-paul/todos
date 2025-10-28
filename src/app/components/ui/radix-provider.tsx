import { Theme, type ThemeProps } from "@radix-ui/themes";
import React from "react";
import { useIsMobile } from "@/app/hooks/use-is-mobile";
import { useAppearance } from "@/app/hooks/use-theme";
import { ACCENT_COLOR } from "@/lib/constants";

const RadixProvider: React.FC<ThemeProps> = (props) => {
  const appearance = useAppearance();
  const isMobile = useIsMobile();

  return (
    <Theme
      appearance={appearance}
      hasBackground={false}
      accentColor={ACCENT_COLOR}
      grayColor="gray"
      radius="large"
      scaling={isMobile ? "105%" : "100%"}
      {...props}
    />
  );
};

export default RadixProvider;
