import React from "react";
import { Button } from "../ui/button";
import { Check, X } from "lucide-react";
import useDeleteButton from "@/hooks/use-delete-button";

interface Props {
  handleDelete: () => void;
  noConfirm?: boolean;
}

const DeleteButton: React.FC<Props> = (props) => {
  const { handleDelete, noConfirm } = props;

  const { ref, isConfirming, handleClick } = useDeleteButton({
    handleDelete,
    noConfirm,
  });

  return (
    <Button
      ref={ref}
      size="icon"
      type="button"
      variant={isConfirming ? "destructive" : "ghostMuted"}
      className="size-7 shrink-0 rounded-full"
      onClick={handleClick}
    >
      {isConfirming ? <Check className="size-4" /> : <X className="size-4" />}
    </Button>
  );
};

export default DeleteButton;
