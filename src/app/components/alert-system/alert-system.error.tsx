import React from "react";
import type { ErrorAlertProps } from "./alert-system.types";
import { Dialog, Button } from "@radix-ui/themes";

const AlertSystemContentError: React.FC<ErrorAlertProps> = ({}) => {
  return (
    <>
      <footer className="flex flex-col justify-end gap-3 xs:flex-row">
        <Dialog.Close>
          <Button size="3">Ok</Button>
        </Dialog.Close>
      </footer>
    </>
  );
};

export default AlertSystemContentError;
