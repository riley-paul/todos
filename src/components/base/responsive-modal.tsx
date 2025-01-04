import React from "react";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { Dialog, Portal } from "@radix-ui/themes";
import { Drawer } from "vaul";
import RadixProvider from "../radix-provider";

type Props = React.PropsWithChildren<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
}>;

const ResponsiveModal: React.FC<Props> = ({ open, onOpenChange, children }) => {
  const isMobile = useIsMobile(512);

  if (isMobile) {
    return (
      <Drawer.Root open={open} onOpenChange={onOpenChange}>
        <Portal>
          <RadixProvider>
            <Drawer.Overlay className=" fixed inset-0 bg-blackA-6" />
            <Drawer.Content className="fixed bottom-0 left-0 right-0 mt-24 flex h-fit flex-col rounded-t-3 border border-b-0 bg-panel-solid outline-none">
                <Drawer.Handle className="mt-3" />
              <div className="hide-scrollbar grid max-h-[85vh] gap-4 overflow-y-auto px-4 pt-4 pb-8">
                {children}
              </div>
            </Drawer.Content>
          </RadixProvider>
        </Portal>
      </Drawer.Root>
    );
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content className="hide-scrollbar grid max-h-[85vh] w-full gap-4 overflow-y-auto border-none p-6 sm:max-w-lg">
        {children}
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default ResponsiveModal;
