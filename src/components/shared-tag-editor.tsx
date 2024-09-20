import React from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "./ui/button";
import { useQuery } from "@tanstack/react-query";
import { sharedTagsQueryOptions } from "@/lib/queries";
import SharedTagCreator from "./shared-tag-creator";
import { Card } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import useMutations from "@/hooks/use-mutations";
import DeleteButton from "./ui/delete-button";
import HashtagLink from "./hashtag-link";

const SharedTagEditor: React.FC = () => {
  const { data = [] } = useQuery(sharedTagsQueryOptions);

  const { deleteSharedTag } = useMutations();

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
            <div className="flex w-full items-center gap-2">
              <Card
                key={tag.SharedTags.id}
                className="flex flex-1 justify-between bg-background px-4 py-2 text-sm"
              >
                <HashtagLink
                  tag={tag.SharedTags.tag}
                  string={tag.SharedTags.tag}
                />
                <span className="flex items-center gap-2 text-muted-foreground">
                  {tag.User.name}
                  <Avatar className="size-5">
                    <AvatarImage src={tag.User.avatarUrl ?? ""} />
                    <AvatarFallback>
                      {tag.User.name.slice(0, 1).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </span>
              </Card>
              <DeleteButton
                handleDelete={() =>
                  deleteSharedTag.mutate({ id: tag.SharedTags.id })
                }
              />
            </div>
          ))}
        </div>
        <SharedTagCreator />
      </PopoverContent>
    </Popover>
  );
};

export default SharedTagEditor;
