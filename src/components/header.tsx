import React from "react";
import { cn } from "../lib/utils";
import UserAvatar from "./user-avatar";
import PendingInvites from "./pending-invites";

const Header: React.FC = () => {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 h-16 shrink-0 border-b bg-background/30 backdrop-blur",
      )}
    >
      <div className="container2 flex h-full items-center justify-between px-5">
        <div className="flex items-center gap-2 text-2xl">
          <i className="fa-solid fa-check-double text-primary" />
          <div className="font-bold">Todos</div>
        </div>
        <div className="flex items-center gap-4">
          <PendingInvites />
          <UserAvatar />
        </div>
      </div>
    </header>
  );
};

export default Header;
