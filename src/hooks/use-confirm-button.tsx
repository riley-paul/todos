import type { ButtonProps } from "@radix-ui/themes";
import React from "react";
import { useEventListener, useOnClickOutside } from "usehooks-ts";

interface Props {
  handleConfirm: () => void;
  noConfirm?: boolean;
  buttonVariantIdle?: ButtonProps["variant"];
  buttonVariantConfirm?: ButtonProps["variant"];
}

export default function useConfirmButton(props: Props) {
  const {
    handleConfirm,
    noConfirm,
    buttonVariantIdle = "soft",
    buttonVariantConfirm = "solid",
  } = props;

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
      handleConfirm();
      return;
    }

    if (isConfirming) {
      handleConfirm();
      setIsConfirming(false);
      return;
    }

    setIsConfirming(true);
  };

  const buttonProps: ButtonProps = {
    variant: isConfirming ? buttonVariantConfirm : buttonVariantIdle,
    onClick: handleClick,
  };

  return {
    ref,
    isConfirming,
    buttonProps,
  };
}
