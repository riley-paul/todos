import React from "react";
import useConfirmButton from "@/hooks/use-confirm-button";
import { IconButton } from "@radix-ui/themes";

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
      {isConfirming ? <i className="fa-solid fa-check" /> : <i className="fa-solid fa-xmark" />}
    </IconButton>
  );
};

export default DeleteButton;
