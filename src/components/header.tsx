import type React from "react";
import { CircleCheckBig } from "lucide-react";

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 h-16 border-b bg-background">
      <div className="container2 flex items-center h-full justify-between">
        <div className="flex items-center gap-2">
          <CircleCheckBig size="1.5rem" className="text-primary" />
          <div className="text-2xl font-bold">Todos</div>
        </div>
      </div>
    </header>
  );
};

export default Header;
