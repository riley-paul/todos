import React from "react";
import { useMediaQuery } from "usehooks-ts";
import { MOBILE_MEDIA_QUERY } from "../lib/constants";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/app/components/ui/dialog";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/app/components/ui/drawer";
import { cn } from "../lib/utils";

type Props = React.PropsWithChildren<{
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;

  title: string;
  description?: string;
  footer?: React.ReactNode;
  footerProps?: React.HTMLAttributes<HTMLDivElement>;
}>;

const AdvancedDialog: React.FC<Props> = (props) => {
  const {
    isOpen,
    setIsOpen,
    title,
    description,
    children,
    footer,
    footerProps,
  } = props;
  const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY);

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>{title}</DrawerTitle>
            {description && (
              <DrawerDescription>{description}</DrawerDescription>
            )}
          </DrawerHeader>
          <div className={cn("px-4", !footer && "pb-6")}>{children}</div>
          {footer && <DrawerFooter {...footerProps}>{footer}</DrawerFooter>}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children}
        {footer && <DialogFooter {...footerProps}>{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
};

export default AdvancedDialog;
