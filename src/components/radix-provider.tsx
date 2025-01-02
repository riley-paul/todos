import { Theme } from "@radix-ui/themes";
import React from "react";
import { useDarkMode } from "usehooks-ts";

const RadixProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { isDarkMode } = useDarkMode();

  return (
    <Theme
      appearance={isDarkMode ? "dark" : "light"}
      accentColor="mint"
      radius="large"
    >
      {children}
    </Theme>
  );
};

export default RadixProvider;
