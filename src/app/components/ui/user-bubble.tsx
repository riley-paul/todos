import type { UserSelect } from "@/lib/types";
import { cn } from "@/lib/client/utils";
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

const avatarSizeMap = {
  sm: "1",
  md: "3",
  lg: "4",
} as const;

const UserBubble: React.FC<Props> = (props) => {
  const { user, size = "sm" } = props;

  return (
    <Avatar
      radius="full"
      size={avatarSizeMap[size]}
      src={user.avatarUrl ?? ""}
      alt={user.name}
      fallback={user.name[0]}
      className={cn(sizeMap[size])}
    />
  );
};

export default UserBubble;
