import { AlertDialog, Button, Flex } from "@radix-ui/themes";
import React from "react";

type Props = {
  title?: string;
  description?: string;
};

export default function useConfirmDialog({
  title = "Confirm Action",
  description = "Are you certain you want to proceed? This action is irreversible and your data will be permanently erased.",
}: Props): [React.FC, () => Promise<unknown>] {
  const [promise, setPromise] = React.useState<{
    resolve: (value: boolean) => void;
  } | null>(null);

  const confirm = () =>
    new Promise((resolve) => {
      setPromise({ resolve });
    });

  const handleClose = () => {
    setPromise(null);
  };

  const handleConfirm = () => {
    promise?.resolve(true);
    handleClose();
  };

  const handleCancel = () => {
    promise?.resolve(false);
    handleClose();
  };

  const ConfirmationDialog: React.FC = () => (
    <AlertDialog.Root open={promise !== null} onOpenChange={handleClose}>
      <AlertDialog.Content maxWidth="450px">
        <AlertDialog.Title>{title}</AlertDialog.Title>
        <AlertDialog.Description size="2">
          {description}
        </AlertDialog.Description>

        <Flex gap="3" mt="4" justify="end">
          <AlertDialog.Cancel>
            <Button variant="soft" color="gray" onClick={handleCancel}>
              Cancel
            </Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action>
            <Button variant="solid" color="red" onClick={handleConfirm}>
              Confirm
            </Button>
          </AlertDialog.Action>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );

  return [ConfirmationDialog, confirm] as const;
}
