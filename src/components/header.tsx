import { CircleCheckBig, Share } from "lucide-react";
import React from "react";
import { cn } from "../lib/utils";
import UserAvatar from "./user-avatar";
import { Link } from "react-router-dom";
import { buttonVariants } from "./ui/button";

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
        <div className="flex items-center gap-3">
          <Link
            to="/shared"
            className={cn(buttonVariants({ variant: "link", size: "sm" }))}
          >
            <Share className="mr-2 size-4" />
            <span>Shared</span>
          </Link>
          <UserAvatar />
        </div>
      </div>
    </header>
  );
};

export default Header;
