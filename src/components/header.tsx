import React from "react";
import UserAvatar from "./user-avatar";
import PendingInvites from "./pending-invites";
import { Container, Text } from "@radix-ui/themes";
import { CheckCircleIcon } from "lucide-react";

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-7 bg-panel-translucent">
      <Container size="2">
        <div className="flex items-center justify-between px-rx-3 py-rx-3">
          <div className="flex items-center gap-2">
            <CheckCircleIcon className="size-7 text-accent-10" />
            <Text size="6" weight="bold">
              Todos
            </Text>
          </div>
          <div className="flex items-center gap-4">
            <PendingInvites />
            <UserAvatar />
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Header;
