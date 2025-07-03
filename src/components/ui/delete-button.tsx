import React from "react";
import useConfirmButton from "@/hooks/use-confirm-button";
import { IconButton } from "@radix-ui/themes";
import { CheckIcon, XIcon } from "lucide-react";

interface Props {
  handleDelete: () => void;
  noConfirm?: boolean;
}

const DeleteButton: React.FC<Props> = (props) => {
  const { handleDelete, noConfirm } = props;

  const { ref, isConfirming, buttonProps } = useConfirmButton({
    noConfirm,
    handleConfirm: handleDelete,
  });

  return (
    <IconButton ref={ref} size="1" radius="full" type="button" {...buttonProps}>
      {isConfirming ? (
        <CheckIcon className="size-4" />
      ) : (
        <XIcon className="size-4" />
      )}
    </IconButton>
  );
};

export default DeleteButton;
