import { Theme } from "@radix-ui/themes";
import React from "react";

const RadixProvider: React.FC<React.PropsWithChildren> = ({ children }) => (
  <Theme appearance="dark" accentColor="mint" radius="large">
    {children}
  </Theme>
);

export default RadixProvider;
