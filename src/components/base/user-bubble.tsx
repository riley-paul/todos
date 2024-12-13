import type { UserSelect } from "@/lib/types";
import { Avatar, type AvatarProps } from "@radix-ui/themes";
import React from "react";

type Size = "sm" | "md" | "lg";

type Props = {
  user: UserSelect;
  size?: Size;
};

const sizeMap: Record<Size, AvatarProps["size"]> = {
  sm: "1",
  md: "2",
  lg: "3",
};

const UserBubble: React.FC<Props> = (props) => {
  const { user, size = "sm" } = props;

  return (
    <Avatar
      radius="full"
      src={user.avatarUrl ?? ""}
      fallback={user.name[0]}
      size={sizeMap[size]}
    />
  );
};

export default UserBubble;
