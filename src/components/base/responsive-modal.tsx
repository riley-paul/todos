import React from "react";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { Dialog } from "@radix-ui/themes";
import { Drawer, DrawerContent } from "@/components/ui/drawer";

type Props = React.PropsWithChildren<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
}>;

const ResponsiveModal: React.FC<Props> = ({ open, onOpenChange, children }) => {
  const isMobile = useIsMobile(512);

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>{children}</DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content>{children}</Dialog.Content>
    </Dialog.Root>
  );
};

export default ResponsiveModal;
