import type { UserSelect } from "@/lib/types";
import React from "react";
import { Avatar, Flex } from "@radix-ui/themes";
import UserBubble from "./user-bubble";

type Props = {
  users: UserSelect[];
  numAvatars?: number;
};

const UserBubbleGroup: React.FC<Props> = ({ users, numAvatars = 3 }) => {
  if (users.length === 0) {
    return null;
  }

  return (
    <Flex wrap="wrap-reverse" pl="1">
      {users.slice(0, numAvatars).map((user) => (
        <div style={{ marginLeft: "-0.25rem" }}>
          <UserBubble key={user.id} user={user} size="sm" />
        </div>
      ))}
      {users.length > numAvatars && (
        <Avatar
          src=""
          fallback={`+${users.length - numAvatars}`}
          radius="full"
          style={{ height: "1rem", fontSize: "0.6rem", marginLeft: "-0.25rem" }}
          size="1"
        />
      )}
    </Flex>
  );
};

export default UserBubbleGroup;
