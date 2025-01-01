import React from "react";
import { Drawer } from "vaul";
import RadixProvider from "./radix-provider";

type Props = React.PropsWithChildren<{
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}>;

const VaulDrawer: React.FC<Props> = ({ isOpen, setIsOpen, children }) => {
  return (
    <Drawer.Root open={isOpen} onOpenChange={setIsOpen}>
      <Drawer.Portal>
        <RadixProvider>
          <Drawer.Overlay className="fixed inset-0 bg-blackA-5" />
          <Drawer.Content className="container2 fixed bottom-0 left-0 right-0 mt-24 h-fit min-h-48 rounded-t-4 border border-b-0 border-gray-7 bg-panel-translucent py-2 outline-none">
            <Drawer.Handle />
            <div className="p-rx-4">{children}</div>
          </Drawer.Content>
        </RadixProvider>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export default VaulDrawer;
