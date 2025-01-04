import { Theme } from "@radix-ui/themes";
import React from "react";
import { useDarkMode } from "usehooks-ts";

const RadixProvider = React.forwardRef<HTMLDivElement, React.PropsWithChildren>(
  ({ children }, ref) => {
    const { isDarkMode } = useDarkMode({ defaultValue: true });

    return (
      <Theme
        ref={ref}
        appearance={isDarkMode ? "dark" : "light"}
        accentColor="mint"
        radius="large"
        scaling="105%"
      >
        {children}
      </Theme>
    );
  },
);

export default RadixProvider;
