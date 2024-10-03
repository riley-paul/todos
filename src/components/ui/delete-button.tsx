import React from "react";
import { Button } from "./button";
import { Check, X } from "lucide-react";
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
      {isConfirming ? <Check className="size-4" /> : <X className="size-4" />}
    </Button>
  );
};

export default DeleteButton;
