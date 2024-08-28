import React from "react";
import { Button } from "../ui/button";
import { Check, X } from "lucide-react";
import { useOnClickOutside } from "usehooks-ts";

interface Props {
  handleDelete: () => void;
  noConfirm?: boolean;
}

const DeleteButton: React.FC<Props> = (props) => {
  const { handleDelete, noConfirm } = props;

  const ref = React.useRef<HTMLButtonElement>(null);
  const [isConfirming, setIsConfirming] = React.useState(false);

  useOnClickOutside(ref, () => setIsConfirming(false));

  return (
    <Button
      ref={ref}
      size="icon"
      variant={isConfirming ? "destructive" : "ghostMuted"}
      className="size-7 shrink-0 rounded-full"
      onClick={() => {
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
      {isConfirming ? <Check className="size-4" /> : <X className="size-4" />}
    </Button>
  );
};

export default DeleteButton;
