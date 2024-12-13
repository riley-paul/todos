import type { UserSelect } from "@/lib/types";
import React from "react";
import { cn } from "@/lib/utils";
import { Avatar } from "@radix-ui/themes";

type Props = {
  users: UserSelect[];
  numAvatars?: number;
};

const UserBubbleGroup: React.FC<Props> = ({ users, numAvatars = 3 }) => {
  if (users.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-row-reverse">
      {users.length > numAvatars && (
        <div
          className={cn(
            "-ml-1 flex h-4 items-center rounded-full bg-muted px-1.5 font-mono text-[0.6rem] text-muted-foreground transition-colors"
          )}
        >
          <span>+{users.length - numAvatars}</span>
        </div>
      )}
      {users.slice(0, numAvatars).map((user) => (
        <Avatar
          size="1"
          radius="full"
          key={user.id}
          src={user.avatarUrl ?? ""}
          fallback={user.name[0]}
          className="-ml-1 size-4 last:ml-0"
        />
      ))}
    </div>
  );
};

export default UserBubbleGroup;
