import type React from "react";
import { CircleCheckBig } from "lucide-react";
import { Button } from "./ui/button";
import { useQuery } from "@tanstack/react-query";
import { getProfileQP } from "@/lib/queries";

const Header: React.FC = () => {
  const profileQuery = useQuery(getProfileQP);

  return (
    <header className="sticky top-0 z-50 h-16 border-b bg-background">
      <div className="container2 flex h-full items-center justify-between">
        <div className="flex items-center gap-2">
          <CircleCheckBig size="1.5rem" className="text-primary" />
          <div className="text-2xl font-bold">Todos</div>
        </div>
        <form action="/api/auth/logout" method="POST">
          {profileQuery.data?.id}
          <Button type="submit" variant="outline">
            Logout
          </Button>
        </form>
      </div>
    </header>
  );
};

export default Header;
