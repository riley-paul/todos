import React from "react";
import { useAtom } from "jotai/react";
import type { AlertProps } from "./alert-system.types";
import { alertSystemAtom } from "./alert-system.store";
import AlertSystemContentDelete from "./alert-system.delete";
import AlertSystemContentError from "./alert-system.error";
import AlertSystemContentInput from "./alert-system.input";
import { Dialog } from "@radix-ui/themes";
import ResponsiveDialogContent from "../ui/responsive-dialog-content";

const AlertContent: React.FC<AlertProps> = (props) => {
  switch (props.type) {
    case "delete":
      return <AlertSystemContentDelete {...props} />;
    case "error":
      return <AlertSystemContentError {...props} />;
    case "input":
      return <AlertSystemContentInput {...props} />;
    default:
      throw new Error(`Unsupported alert type`);
  }
};

const AlertSystem: React.FC = () => {
  const [state, dispatch] = useAtom(alertSystemAtom);

  return (
    <Dialog.Root
      open={state.isOpen}
      onOpenChange={(open) => open || dispatch({ type: "close" })}
    >
      <ResponsiveDialogContent fullHeightDrawer={state.data?.type === "input"}>
        {state.data && (
          <React.Fragment>
            <header>
              <Dialog.Title>{state.data.title}</Dialog.Title>
              <Dialog.Description color="gray">
                {state.data.message}
              </Dialog.Description>
            </header>
            <AlertContent {...state.data} />
          </React.Fragment>
        )}
      </ResponsiveDialogContent>
    </Dialog.Root>
  );
};

export default AlertSystem;
