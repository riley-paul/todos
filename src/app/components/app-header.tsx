import { Text } from "@radix-ui/themes";
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
            <Link to="/">
              <CircleCheckBigIcon className="size-6 text-accent-10" />
            </Link>
            <Text>/</Text>
            <ListsMenu lists={lists} />
          </section>
          <section className="flex items-center gap-4">
            <ConnectionState />
            <AppSearch />
            <UserMenu />
          </section>
        </article>
      </div>
    </header>
  );
};

export default AppHeader;
