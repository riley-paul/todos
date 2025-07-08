import { useIsMobile } from "@/hooks/use-is-mobile";
import { Dialog, Text } from "@radix-ui/themes";
import React from "react";
import Drawer from "./drawer";

type Props = React.PropsWithChildren<{
  open?: boolean;
  onOpenChange?: (open: boolean) => void;

  title?: string;
  description?: string;
}>;

const ResponsiveDialog: React.FC<Props> = ({
  open,
  onOpenChange,
  title,
  description,
  children,
}) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Drawer.Root open={open} onOpenChange={onOpenChange}>
        <Drawer.Content>
          {(title || description) && (
            <header className="flex flex-col gap-1">
              {title && (
                <Drawer.Title>
                  <Text size="3" weight="medium">
                    {title}
                  </Text>
                </Drawer.Title>
              )}
              {description && (
                <Drawer.Description>
                  <Text size="2" color="gray">
                    {description}
                  </Text>
                </Drawer.Description>
              )}
            </header>
          )}
          {children}
        </Drawer.Content>
      </Drawer.Root>
    );
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content>
        {title && <Dialog.Title size="3">{title}</Dialog.Title>}
        {description && (
          <Dialog.Description size="2" color="gray">
            {description}
          </Dialog.Description>
        )}
        {children}
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default ResponsiveDialog;
