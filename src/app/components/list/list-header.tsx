import type { ListSelect } from "@/lib/types";
import { Heading } from "@radix-ui/themes";
import React from "react";
import ListMenu from "./list-menu";
import ListSharing from "./list-sharing";
import { cn } from "@/app/lib/utils";

type Props = { list: ListSelect };

const ListHeader: React.FC<Props> = ({ list }) => {
  return (
    <header
      className={cn(
        "flex items-baseline gap-4",
        list.name.length > 18 && "flex-col sm:flex-row",
      )}
    >
      <Heading as="h2" size="7">
        {list.name}
      </Heading>
      <section className="flex items-center gap-4">
        <ListMenu list={list} />
        <ListSharing list={list} />
      </section>
    </header>
  );
};

export default ListHeader;
