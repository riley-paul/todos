import React from "react";
import UserAvatar from "./user-avatar";
import PendingInvites from "./pending-invites";
import { Heading } from "@radix-ui/themes";
import { CheckCircleIcon } from "lucide-react";

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-7 bg-panel-translucent backdrop-blur">
      <div className="container2">
        <div className="flex items-center justify-between px-rx-3 py-rx-3">
          <div className="flex items-center gap-2">
            <CheckCircleIcon className="size-7 text-accent-9" />
            <Heading size="6" weight="bold">
              Todos
            </Heading>
          </div>
          <div className="flex items-center gap-4">
            <PendingInvites />
            <UserAvatar />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
