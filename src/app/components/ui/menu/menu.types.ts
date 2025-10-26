import type { ThemeProps } from "@radix-ui/themes";
import type { LinkOptions } from "@tanstack/react-router";

export type BaseMenuItem = {
  key: string;
  text: React.ReactNode;
  icon?: React.ReactNode;

  color?: ThemeProps["accentColor"];
  disabled?: boolean;
  hide?: boolean;
};

export type MenuItem =
  | ({
      type: "item";
      onClick: () => void;
    } & BaseMenuItem)
  | ({
      type: "link";
      linkOptions: LinkOptions;
    } & BaseMenuItem)
  | ({
      type: "anchor";
      anchorOptions: React.AnchorHTMLAttributes<HTMLAnchorElement>;
    } & BaseMenuItem)
  | ({
      type: "parent";
      children: MenuItem[];
    } & BaseMenuItem)
  | {
      type: "separator";
      hide?: boolean;
    }
  | {
      type: "custom";
      component: React.ReactNode;
      hide?: boolean;
    };
