import React from "react";
import UserMenu from "./user-menu";
import PendingInvites from "./pending-invites";
import { Heading } from "@radix-ui/themes";

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 border-b bg-panel-translucent backdrop-blur">
      <div className="container2">
        <div className="flex items-center justify-between px-rx-3 py-rx-3">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-check-double text-7 text-accent-9" />
            <Heading size="6" weight="bold">
              Todos
            </Heading>
          </div>
          <div className="flex items-center gap-4">
            <PendingInvites />
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
