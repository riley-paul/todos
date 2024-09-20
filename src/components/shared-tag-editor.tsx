import React from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "./ui/button";
import { useQuery } from "@tanstack/react-query";
import { sharedTagsQueryOptions } from "@/lib/queries";
import { Separator } from "./ui/separator";
import SharedTagCreator from "./shared-tag-creator";

const SharedTagEditor: React.FC = () => {
  const { data = [] } = useQuery(sharedTagsQueryOptions);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm">
          Tags
        </Button>
      </PopoverTrigger>
      <PopoverContent className="grid gap-3 w-[24rem]" align="end">
        <h2 className="text-sm font-bold uppercase text-secondary-foreground/80">
          Shared Tags
        </h2>

        <div className="grid gap-2">
          {data.map((tag) => (
            <div key={tag.id}>{tag.tag}</div>
          ))}
        </div>
        <Separator />
        <SharedTagCreator />
      </PopoverContent>
    </Popover>
  );
};

export default SharedTagEditor;
