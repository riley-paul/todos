import type { ButtonProps } from "@radix-ui/themes";
import React from "react";
import { useEventListener, useOnClickOutside } from "usehooks-ts";

interface Props {
  handleConfirm: () => void;
  noConfirm?: boolean;
  buttonVariantIdle?: ButtonProps["variant"];
  buttonColorIdle?: ButtonProps["color"];
  buttonVariantConfirm?: ButtonProps["variant"];
  buttonColorConfirm?: ButtonProps["color"];
}

export default function useConfirmButton(props: Props) {
  const {
    handleConfirm,
    noConfirm,
    buttonVariantIdle = "soft",
    buttonColorIdle = "gray",
    buttonVariantConfirm = "solid",
    buttonColorConfirm = "red",
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
    color: isConfirming ? buttonColorConfirm : buttonColorIdle,
    onClick: handleClick,
  };

  return {
    ref,
    isConfirming,
    buttonProps,
  };
}
