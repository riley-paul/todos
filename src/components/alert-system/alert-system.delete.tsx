import React from "react";
import type { DeleteAlertProps } from "./alert-system.types";
import { Dialog, Button } from "@radix-ui/themes";

const AlertSystemContentDelete: React.FC<DeleteAlertProps> = ({
  title,
  message,
  handleDelete,
  confirmButtonProps,
}) => {
  return (
    <>
      <Dialog.Title>{title}</Dialog.Title>
      <Dialog.Description>{message}</Dialog.Description>
      <footer className="mt-4 flex justify-end gap-3">
        <Dialog.Close>
          <Button variant="soft" color="gray">
            Cancel
          </Button>
        </Dialog.Close>
        <Button
          onClick={handleDelete}
          color="red"
          children="Delete"
          {...confirmButtonProps}
        />
      </footer>
    </>
  );
};

export default AlertSystemContentDelete;
