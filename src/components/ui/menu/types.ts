import type { ThemeProps } from "@radix-ui/themes";
import type { LinkOptions } from "@tanstack/react-router";

export type MenuItem =
  | {
      type: "item";
      key: string;

      text: string;
      icon?: React.ReactNode;

      onClick?: () => void;
      children?: MenuItem[];

      linkOptions?: LinkOptions;
      anchorOptions?: React.AnchorHTMLAttributes<HTMLAnchorElement>;

      color?: ThemeProps["accentColor"];
      disabled?: boolean;
      hide?: boolean;
    }
  | {
      type: "separator";
      hide?: boolean;
    };
