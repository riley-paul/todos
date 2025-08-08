import React from "react";
import { Link } from "@tanstack/react-router";
import { CircleCheckBigIcon } from "lucide-react";
import { Text } from "@radix-ui/themes";
import ConnectionState from "./connection-state";
import AppSearch from "./app-search";
import UserMenu from "./user-menu";

type Props = React.PropsWithChildren<{
  breadcrumb?: React.ReactNode;
}>;

const AppLayout: React.FC<Props> = ({ breadcrumb, children }) => {
  return (
    <>
      <header className="sticky top-0 z-50 border-b bg-panel-translucent backdrop-blur">
        <div className="container2">
          <article className="flex items-center justify-between px-3 py-3">
            <section className="flex items-center gap-4">
              <Link to="/">
                <CircleCheckBigIcon className="size-6 text-accent-10" />
              </Link>
              {breadcrumb && (
                <>
                  <Text>/</Text>
                  {breadcrumb}
                </>
              )}
            </section>
            <section className="flex items-center gap-4">
              <ConnectionState />
              <AppSearch />
              <UserMenu />
            </section>
          </article>
        </div>
      </header>
      <div className="container2 pb-24 pt-6">{children}</div>
    </>
  );
};

export default AppLayout;
