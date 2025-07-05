import type { ThemeProps } from "@radix-ui/themes";

export type MenuItem =
  | {
      type: "item";
      key: string;
      text: string;
      icon?: React.ReactNode;
      onClick?: () => void;
      children?: MenuItem[];
      color?: ThemeProps["accentColor"];

      disabled?: boolean;
      hide?: boolean;
    }
  | {
      type: "separator";
      hide?: boolean;
    };
