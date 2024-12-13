import type { UserSelect } from "@/lib/types";
import { Avatar } from "@radix-ui/themes";
import React from "react";

type Size = "sm" | "md" | "lg";

type Props = {
  user: UserSelect;
  size?: Size;
};

const sizeMap: Record<Size, string> = {
  sm: "1rem",
  md: "1.5rem",
  lg: "2rem",
};

const UserBubble: React.FC<Props> = (props) => {
  const { user, size = "sm" } = props;

  return (
    <Avatar
      style={{ height: sizeMap[size], width: sizeMap[size] }}
      radius="full"
      src={user.avatarUrl ?? ""}
      fallback={user.name[0]}
    />
  );
};

export default UserBubble;
