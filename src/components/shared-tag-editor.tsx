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
import { Card } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const SharedTagEditor: React.FC = () => {
  const { data = [] } = useQuery(sharedTagsQueryOptions);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm">
          Tags
        </Button>
      </PopoverTrigger>
      <PopoverContent className="grid w-[24rem] gap-3" align="end">
        <h2 className="text-sm font-bold uppercase text-secondary-foreground/80">
          Shared Tags
        </h2>

        <div className="grid gap-1">
          {data.map((tag) => (
            <Card
              key={tag.SharedTags.id}
              className="flex justify-between bg-background px-4 py-2"
            >
              <span>{tag.SharedTags.tag}</span>
              <span className="flex gap-2 text-sm text-muted-foreground">
                {tag.User.name}
                <Avatar className="size-5">
                  <AvatarImage src={tag.User.avatarUrl ?? ""} />
                  <AvatarFallback>
                    {tag.User.name.slice(0, 1).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </span>
            </Card>
          ))}
        </div>
        <Separator />
        <SharedTagCreator />
      </PopoverContent>
    </Popover>
  );
};

export default SharedTagEditor;
