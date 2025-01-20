import type { UserSelect } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Avatar } from "@radix-ui/themes";
import React from "react";

type Size = "sm" | "md" | "lg";

type Props = {
  user: UserSelect;
  size?: Size;
};

const sizeMap: Record<Size, string> = {
  sm: "size-4",
  md: "size-6",
  lg: "size-12",
};

const UserBubble: React.FC<Props> = (props) => {
  const { user, size = "sm" } = props;

  return (
    <Avatar
      radius="full"
      src={user.avatarUrl ?? ""}
      alt={user.name}
      fallback={user.name[0]}
      className={cn(sizeMap[size])}
    />
  );
};

export default UserBubble;
