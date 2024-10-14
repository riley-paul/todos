import React from "react";
import { Button } from "./button";
import useConfirmButton from "@/hooks/use-confirm-button";

interface Props {
  handleDelete: () => void;
  noConfirm?: boolean;
}

const DeleteButton: React.FC<Props> = (props) => {
  const { handleDelete, noConfirm } = props;

  const { ref, isConfirming, buttonProps } = useConfirmButton({
    noConfirm,
    handleConfirm: handleDelete,
    buttonVariantIdle: "ghostMuted",
  });

  return (
    <Button
      ref={ref}
      size="icon"
      type="button"
      className="size-7 shrink-0 rounded-full"
      {...buttonProps}
    >
      {isConfirming ? (
        <i className="fa-solid fa-check" />
      ) : (
        <i className="fa-solid fa-xmark" />
      )}
    </Button>
  );
};

export default DeleteButton;
