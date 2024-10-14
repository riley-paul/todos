import type { UserSelect } from "@/lib/types";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type Props = {
  users: UserSelect[];
  numAvatars?: number;
};

const UserBubbleGroup: React.FC<Props> = ({ users, numAvatars = 3 }) => {
  if (users.length === 0) {
    return null;
  }

  return (
    <div className="flex">
      {users.slice(0, numAvatars).map((user) => (
        <Avatar key={user.id} className="-ml-1 size-4 first:ml-0">
          <AvatarImage src={user.avatarUrl ?? ""} alt={user.name} />
          <AvatarFallback>{user.name[0]} </AvatarFallback>
        </Avatar>
      ))}
      {users.length > numAvatars && (
        <div
          className={cn(
            "z-10 -ml-1 flex h-4 items-center rounded-full bg-muted px-1 text-[0.6rem] text-muted-foreground transition-colors",
          )}
        >
          <span>+{users.length - numAvatars}</span>
        </div>
      )}
    </div>
  );
};

export default UserBubbleGroup;
