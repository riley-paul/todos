import { IconButton, type IconButtonProps } from "@radix-ui/themes";
import { useRouter } from "@tanstack/react-router";
import { ArrowLeftIcon } from "lucide-react";
import React from "react";

const BackButton: React.FC<IconButtonProps> = (props) => {
  const router = useRouter();

  if (!router.history.canGoBack()) return null;

  return (
    <IconButton
      onClick={() => router.history.back()}
      variant="soft"
      size="3"
      radius="full"
      {...props}
    >
      <ArrowLeftIcon className="size-5" />
    </IconButton>
  );
};

export default BackButton;
