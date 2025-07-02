import React from "react";
import type { ErrorAlertProps } from "./alert-system.types";
import { Dialog, Button } from "@radix-ui/themes";

const AlertSystemContentError: React.FC<ErrorAlertProps> = ({
  title,
  message,
}) => {
  return (
    <>
      <Dialog.Title>{title}</Dialog.Title>
      <Dialog.Description>{message}</Dialog.Description>
      <footer className="mt-4 flex justify-end gap-3">
        <Dialog.Close>
          <Button>Ok</Button>
        </Dialog.Close>
      </footer>
    </>
  );
};

export default AlertSystemContentError;
