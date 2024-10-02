import React from "react";
import { useEventListener, useOnClickOutside } from "usehooks-ts";

interface Props {
  handleDelete: () => void;
  noConfirm?: boolean;
}

export default function useDeleteButton({ handleDelete, noConfirm }: Props) {
  const ref = React.useRef<HTMLButtonElement>(null);
  const [isConfirming, setIsConfirming] = React.useState(false);

  useOnClickOutside(ref, () => setIsConfirming(false));
  useEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      setIsConfirming(false);
      ref.current?.blur();
    }
  });

  const handleClick = () => {
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
  };

  return {
    ref,
    isConfirming,
    handleClick,
  };
}
