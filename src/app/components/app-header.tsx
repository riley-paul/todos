import { Link } from "@tanstack/react-router";
import { CircleCheckBigIcon } from "lucide-react";
import { Heading, Separator } from "@radix-ui/themes";
import UserMenu from "./user-menu";
import ConnectionState from "./connection-state";
import AppSearch from "./app-search";

import React from "react";
import type { UserSelect } from "@/lib/types";
import { cn } from "../lib/utils";

type Props = {
  currentUser: UserSelect;
};

const AppHeader: React.FC<Props> = ({ currentUser }) => {
  return (
    <header
      className={cn(
        "sticky top-0 z-10 flex h-18 flex-col justify-center",
        "bg-linear-to-t from-[color-mix(in_lch,var(--background)_80%,transparent)] to-[var(--background)] backdrop-blur-md",
      )}
    >
      <div className="container2 flex flex-1 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <CircleCheckBigIcon className="text-accent-10 size-6" />
          <Heading size="4">Todos</Heading>
        </Link>
        <section className="flex items-center gap-3">
          <ConnectionState />
          <AppSearch />
          <UserMenu user={currentUser} />
        </section>
      </div>
      <div className="container2">
        <div className="-mx-3">
          <Separator size="4" />
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
