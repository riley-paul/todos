import React from "react";
import { Button } from "@/components/ui/button";

interface Props {
  handleDelete: () => void;
  noConfirm?: boolean;
}

const DeleteButton: React.FC<Props> = (props) => {
  const { handleDelete, noConfirm } = props;

  const [isConfirming, setIsConfirming] = React.useState(false);
  const cancelDelete = () => setIsConfirming(false);

  React.useEffect(() => {
    if (!isConfirming) return;

    window.addEventListener("click", cancelDelete);
    return () => window.removeEventListener("click", cancelDelete);
  }, [isConfirming]);

  return (
    <Button
      size="sm"
      variant={isConfirming ? "destructive" : "ghostMuted"}
      onClick={(ev) => {
        ev.stopPropagation();
        if (noConfirm) {
          handleDelete();
          return;
        }

        if (isConfirming) {
          handleDelete();
          setIsConfirming(false);
          return;
        }

        setIsConfirming(true);
      }}
    >
      {isConfirming ? "sure?" : "delete"}
    </Button>
  );
};

export default DeleteButton;
