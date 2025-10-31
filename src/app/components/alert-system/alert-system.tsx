import React, { useEffect, useState } from "react";
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
  const [localData, setLocalData] = useState<AlertProps | null>(null);

  useEffect(() => {
    if (state.isOpen && state.data) {
      setLocalData(state.data);
    } else {
      const timeout = setTimeout(() => setLocalData(null), 300);
      return () => clearTimeout(timeout);
    }
  }, [state.isOpen, state.data]);

  return (
    <Dialog.Root
      open={state.isOpen}
      onOpenChange={(open) => open || dispatch({ type: "close" })}
    >
      <ResponsiveDialogContent fullHeightDrawer={state.data?.type === "input"}>
        {localData && (
          <React.Fragment>
            <header>
              <Dialog.Title>{localData.title}</Dialog.Title>
              <Dialog.Description color="gray">
                {localData.message}
              </Dialog.Description>
            </header>
            <AlertContent {...localData} />
          </React.Fragment>
        )}
      </ResponsiveDialogContent>
    </Dialog.Root>
  );
};

export default AlertSystem;
