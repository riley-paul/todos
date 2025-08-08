import { Heading } from "@radix-ui/themes";
import { Link } from "@tanstack/react-router";
import { CircleCheckBigIcon } from "lucide-react";
import React from "react";
import ConnectionState from "./connection-state";
import AppSearch from "./app-search";
import UserMenu from "./user-menu";
import ListsMenu from "./list/lists-menu";
import { useSuspenseQuery } from "@tanstack/react-query";
import { qLists } from "@/lib/client/queries";

const AppHeader: React.FC = () => {
  const { data: lists } = useSuspenseQuery(qLists);
  return (
    <header className="sticky top-0 z-50 border-b bg-panel-translucent backdrop-blur">
      <div className="container2">
        <article className="flex items-center justify-between px-3 py-3">
          <section className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <CircleCheckBigIcon className="size-6 text-accent-10" />
              <Heading asChild size="6" weight="bold">
                <Link to="/">Todos</Link>
              </Heading>
            </div>
            <ConnectionState />
            <ListsMenu lists={lists} />
          </section>
          <section className="flex items-center gap-4">
            <AppSearch />
            <UserMenu />
          </section>
        </article>
      </div>
    </header>
  );
};

export default AppHeader;
