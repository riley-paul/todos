import React from "react";
import ResponsiveDialogContent from "../responsive-dialog-content";
import { Dialog, VisuallyHidden } from "@radix-ui/themes";

type Props = React.PropsWithChildren;

const MenuDrawerContent: React.FC<Props> = ({ children }) => {
  return (
    <ResponsiveDialogContent hideCloseButton className="px-5 pt-2">
      <VisuallyHidden>
        <Dialog.Title>Menu</Dialog.Title>
        <Dialog.Description>
          Contains navigation and actions for the application.
        </Dialog.Description>
      </VisuallyHidden>
      <article className="-mx-5 flex h-full flex-col overflow-x-hidden overflow-y-auto px-5">
        {children}
      </article>
    </ResponsiveDialogContent>
  );
};

export default MenuDrawerContent;
