import { CircleCheckBig } from "lucide-react";
import React from "react";
import { cn } from "../lib/utils";
import UserAvatar from "./user-avatar";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 h-16 shrink-0 border-b bg-background/30 backdrop-blur",
      )}
    >
      <div className="container2 flex h-full items-center justify-between">
        <Link to="/">
          <div className="flex items-center gap-2">
            <CircleCheckBig size="1.5rem" className="text-primary" />
            <div className="text-2xl font-bold">Todos</div>
          </div>
        </Link>
        <UserAvatar />
      </div>
    </header>
  );
};

export default Header;
