import type { UserSelect } from "@/lib/types";
import { Avatar, type AvatarProps } from "@radix-ui/themes";
import React from "react";

type Props = {
  user: UserSelect;
  avatarProps?: Omit<AvatarProps, "src" | "alt" | "fallback" | "radius">;
};

const UserBubble: React.FC<Props> = ({ user, avatarProps }) => {
  return (
    <Avatar
      radius="full"
      src={user.avatarUrl ?? ""}
      alt={user.name}
      fallback={user.name[0]}
      {...avatarProps}
    />
  );
};

export default UserBubble;
