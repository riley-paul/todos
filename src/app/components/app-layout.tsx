import React from "react";
import { Link } from "@tanstack/react-router";
import { CircleCheckBigIcon } from "lucide-react";
import { Heading } from "@radix-ui/themes";
import ConnectionState from "./connection-state";
import AppSearch from "./app-search";
import UserMenu from "./user-menu";

type Props = React.PropsWithChildren<{
  breadcrumb: React.ReactNode;
}>;

const AppLayout: React.FC<Props> = ({ children, breadcrumb }) => {
  return (
    <>
      <header className="sticky top-0 z-50 border-b bg-panel-translucent backdrop-blur">
        <div className="container2">
          <article className="flex items-center justify-between py-3">
            <section className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-2">
                <CircleCheckBigIcon className="size-6 text-accent-10" />
                <Heading size="4">Todos</Heading>
              </Link>
            </section>
            <section className="flex items-center gap-4">
              <ConnectionState />
              <AppSearch />
              <UserMenu />
            </section>
          </article>
        </div>
        {breadcrumb}
      </header>
      <div className="container2 pb-24 pt-6">{children}</div>
    </>
  );
};

export default AppLayout;
