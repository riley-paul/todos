import React from "react";
import { Dialog } from "@radix-ui/themes";
import { useAtom } from "jotai/react";
import type { AlertProps } from "./alert-system.types";
import { alertSystemAtom } from "./alert-system.store";
import AlertSystemContentDelete from "./alert-system.delete";
import AlertSystemContentError from "./alert-system.error";
import AlertSystemContentInput from "./alert-system.input";

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
      <Dialog.Content maxWidth="450px">
        {state.data && <AlertContent {...state.data} />}
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default AlertSystem;
