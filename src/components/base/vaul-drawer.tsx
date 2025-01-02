import React from "react";
import { Drawer } from "vaul";
import RadixProvider from "../radix-provider";
import { Portal, Text } from "@radix-ui/themes";

type Props = React.PropsWithChildren<{
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;

  title?: string;
  description?: string;
}>;

const VaulDrawer: React.FC<Props> = ({
  isOpen,
  setIsOpen,
  title,
  description,
  children,
}) => {
  return (
    <Drawer.Root open={isOpen} onOpenChange={setIsOpen} shouldScaleBackground>
      <Portal>
        <RadixProvider>
          <Drawer.Overlay className="fixed inset-0 bg-blackA-6" />
          <Drawer.Content className="container2 fixed bottom-0 left-0 right-0 mt-24 h-fit min-h-40 rounded-t-4 border border-b-0 border-gray-7 bg-panel py-2 outline-none backdrop-blur">
            <Drawer.Handle />
            <div className="grid gap-4 p-rx-4">
              {(title || description) && (
                <div className="grid">
                  {title && (
                    <Drawer.Title>
                      <Text size="3" weight="bold">
                        {title}
                      </Text>
                    </Drawer.Title>
                  )}
                  {description && (
                    <Drawer.Description>
                      <Text color="gray" size="2">
                        {description}
                      </Text>
                    </Drawer.Description>
                  )}
                </div>
              )}

              {children}
            </div>
          </Drawer.Content>
        </RadixProvider>
      </Portal>
    </Drawer.Root>
  );
};

export default VaulDrawer;
