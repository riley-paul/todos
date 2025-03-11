import { cn } from "@/lib/client/utils";
import { IconButton, Tooltip } from "@radix-ui/themes";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import { toast } from "sonner";

const RefreshButton: React.FC = () => {
  const queryClient = useQueryClient();
  const [isRotating, setIsRotating] = React.useState(false);
  return (
    <Tooltip content="Refresh data" side="left">
      <IconButton
        radius="full"
        variant="soft"
        onClick={() => {
          queryClient.invalidateQueries();
          toast.success("Data refreshed");
          setIsRotating(true);
          setTimeout(() => setIsRotating(false), 1000);
        }}
      >
        <i className={cn("fa-solid fa-rotate", isRotating && "animate-spin")} />
      </IconButton>
    </Tooltip>
  );
};

export default RefreshButton;
