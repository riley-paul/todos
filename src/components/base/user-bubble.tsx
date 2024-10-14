import type { UserSelect } from "@/lib/types";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Size = "sm" | "md" | "lg";

type Props = {
  user: UserSelect;
  size?: Size;
};

const sizeMap: Record<Size, string> = {
  sm: "size-5",
  md: "size-8",
  lg: "size-12",
};

const UserBubble: React.FC<Props> = (props) => {
  const { user, size = "sm" } = props;

  return (
    <Avatar className={sizeMap[size]}>
      <AvatarImage src={user.avatarUrl ?? ""} alt={user.name} />
      <AvatarFallback>{user.name[0]}</AvatarFallback>
    </Avatar>
  );
};

export default UserBubble;
