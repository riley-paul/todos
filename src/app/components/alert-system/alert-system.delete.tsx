import React from "react";
import type { DeleteAlertProps } from "./alert-system.types";
import { Dialog, Button } from "@radix-ui/themes";

const AlertSystemContentDelete: React.FC<DeleteAlertProps> = ({
  handleDelete,
  confirmButtonProps,
}) => {
  return (
    <>
      <footer className="flex flex-col justify-end gap-3 sm:flex-row">
        <Dialog.Close>
          <Button size="3" variant="soft" color="gray">
            Cancel
          </Button>
        </Dialog.Close>
        <Button
          size="3"
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
