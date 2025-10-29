import { useIsMobile } from "@/app/hooks/use-is-mobile";
import { Dialog, IconButton, Theme } from "@radix-ui/themes";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import React from "react";
import { cn } from "@/app/lib/utils";
import { XIcon } from "lucide-react";

type Props = Dialog.ContentProps & {
  fullHeightDrawer?: boolean;
  hideCloseButton?: boolean;
  desktopDrawer?: boolean;
};

const overlayClassName = cn(
  "fixed inset-0 bg-[black]/50 backdrop-blur",
  "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-220 data-[state=open]:duration-220",
  "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
);

const DialogClose: React.FC<{ hide?: boolean }> = ({ hide }) => {
  if (hide) return null;
  return (
    <DialogPrimitive.Close asChild className="absolute top-5 right-5">
      <IconButton variant="ghost" radius="full" size="3" aria-label="Close">
        <XIcon className="size-5" />
      </IconButton>
    </DialogPrimitive.Close>
  );
};

const ResponsiveDialogContent = React.forwardRef<HTMLDivElement, Props>(
  (
    { hideCloseButton, fullHeightDrawer, desktopDrawer, ...contentProps },
    forwardedRef,
  ) => {
    const isMobile = useIsMobile();

    const getClassName = () => {
      if (isMobile) {
        return cn(
          "rounded-t-5 fixed inset-x-0 bottom-0 h-auto max-h-[calc(100%-3rem)] border-b-0 pb-10",
          "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
          fullHeightDrawer && "h-full",
        );
      }

      if (desktopDrawer) {
        return cn(
          "fixed top-0 right-0 h-full w-full max-w-md shadow-lg",
          "border-0 border-l",
          "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
        );
      }

      return cn(
        "rounded-5 fixed top-1/2 left-1/2 max-h-[calc(100%-6rem)] w-full max-w-[min(calc(100%-2rem),40rem)] -translate-x-1/2 -translate-y-1/2 border shadow-lg",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
      );
    };

    return (
      <DialogPrimitive.Portal>
        <Theme asChild>
          <DialogPrimitive.Overlay className={overlayClassName}>
            <DialogPrimitive.Content
              ref={forwardedRef}
              {...contentProps}
              onCloseAutoFocus={(e) => {
                e.preventDefault();
                contentProps.onCloseAutoFocus?.(e);
              }}
              className={cn(
                "bg-panel-solid z-50 flex flex-col gap-6 overflow-hidden border p-6",
                "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-200 data-[state=open]:duration-200",
                getClassName(),
                contentProps.className,
              )}
            >
              {contentProps.children}
              <DialogClose hide={hideCloseButton} />
            </DialogPrimitive.Content>
          </DialogPrimitive.Overlay>
        </Theme>
      </DialogPrimitive.Portal>
    );
  },
);

export default ResponsiveDialogContent;
