import React from "react";
import { useMediaQuery } from "usehooks-ts";
import { MOBILE_MEDIA_QUERY } from "../lib/constants";

import {
  Dialog,
  DialogContent,
  DialogFooter,
} from "@/app/components/ui/dialog";

import { Drawer, DrawerContent } from "@/app/components/ui/drawer";
import type { LucideIcon } from "lucide-react";

type Props = React.PropsWithChildren<{
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;

  icon: LucideIcon;
  title: string;
  description?: string;
  footer?: React.ReactNode;
  footerProps?: React.HTMLAttributes<HTMLDivElement>;
}>;

const Header: React.FC<Props> = (props) => {
  const { title, description, icon: Icon } = props;

  return (
    <div className="flex items-start gap-3">
      <div className="">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <Icon className="h-[1.2rem] w-[1.2rem] text-primary" />
          {title}
        </h2>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  );
};

const AdvancedDialog: React.FC<Props> = (props) => {
  const { isOpen, setIsOpen, children, footer, footerProps } = props;
  const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY);

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerContent className="grid gap-4 px-6 pb-4">
          <Header {...props} />
          {children}
          {footer && (
            <footer className="grid gap-2" {...footerProps}>
              {footer}
            </footer>
          )}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <Header {...props} />
        {children}
        {footer && <DialogFooter {...footerProps}>{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
};

export default AdvancedDialog;
