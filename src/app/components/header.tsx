import React from "react";

const Header: React.FC = () => {
  return (
    <header
      className={cn(
        "z-50 h-16 shrink-0 border-b bg-background",
        isScrolled && "shadow-md",
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
