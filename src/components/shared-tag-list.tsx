import React from "react";

import { useQuery } from "@tanstack/react-query";
import { sharedTagsQueryOptions } from "@/lib/queries";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import useMutations from "@/hooks/use-mutations";
import DeleteButton from "./ui/delete-button";
import HashtagLink from "./hashtag-link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { cn } from "@/lib/utils";
import type { SharedTagSelect, UserSelect } from "@/lib/types";
import { Check, Loader2 } from "lucide-react";
import { Button } from "./ui/button";

const ListPlaceholder: React.FC<React.PropsWithChildren> = ({ children }) => (
  <span
    className={cn(
      "flex min-h-20 items-center justify-center text-xs text-muted-foreground",
      "transition-colors ease-out hover:text-secondary-foreground",
      "p-4",
    )}
  >
    {children}
  </span>
);

const ListHeader: React.FC<React.PropsWithChildren> = ({ children }) => (
  <span className="text-xs font-bold uppercase text-muted-foreground">
    {children}
  </span>
);

const UserAvatar: React.FC<{ user: UserSelect }> = ({ user }) => (
  <span className="flex h-full items-center justify-end gap-2 text-xs text-muted-foreground">
    {user.name}
    <Avatar className="size-6">
      <AvatarImage src={user.avatarUrl ?? ""} />
      <AvatarFallback>{user.name.slice(0, 1).toUpperCase()}</AvatarFallback>
    </Avatar>
  </span>
);

const SharedTagItem: React.FC<{
  tag: SharedTagSelect;
  user: UserSelect;
  createdByUser?: boolean;
}> = ({ tag, user, createdByUser }) => {
  const { deleteSharedTag, approveSharedTag } = useMutations();
  const showApproveButton = tag.isPending && !createdByUser;
  return (
    <div className="flex min-h-11 items-center gap-2 px-2 text-sm transition-colors ease-in hover:bg-muted/20">
      <div className="w-4 text-center">
        {tag.isPending ? (
          <Tooltip>
            <TooltipTrigger>
              <i className="fa-solid fa-hourglass-end text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent side="left">Pending</TooltipContent>
          </Tooltip>
        ) : (
          <Tooltip>
            <TooltipTrigger>
              <i className="fa-solid fa-circle-check text-green-500" />
            </TooltipTrigger>
            <TooltipContent side="left">Approved</TooltipContent>
          </Tooltip>
        )}
      </div>
      <div className="flex-1">
        <HashtagLink tag={tag.tag} string={tag.tag} />
      </div>
      <UserAvatar user={user} />
      {showApproveButton && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => approveSharedTag.mutate({ id: tag.id })}
        >
          <Check className="mr-2 size-4" />
          <span>Approve</span>
        </Button>
      )}
      <DeleteButton
        handleDelete={() => deleteSharedTag.mutate({ id: tag.id })}
      />
    </div>
  );
};

const SharedTagList: React.FC = () => {
  const { data } = useQuery(sharedTagsQueryOptions);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <span>Shared Tags</span>
          <i className="fa-solid fa-tag ml-2 text-primary" />
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2">
        {!data ? (
          <ListPlaceholder>
            <Loader2 className="size-6 animate-spin" />
          </ListPlaceholder>
        ) : (
          <>
            <ListHeader>Shared by you</ListHeader>
            {data.sharedByUser.length > 0 ? (
              <div className="grid divide-y">
                {data.sharedByUser.map((tag) => (
                  <SharedTagItem
                    createdByUser
                    tag={tag.SharedTag}
                    user={tag.User}
                  />
                ))}
              </div>
            ) : (
              <ListPlaceholder>You haven't shared any tags</ListPlaceholder>
            )}

            <div className="h-2" />

            <ListHeader>Shared with you</ListHeader>
            {data.sharedToUser.length > 0 ? (
              <div className="grid divide-y">
                {data.sharedToUser.map((tag) => (
                  <SharedTagItem tag={tag.SharedTag} user={tag.User} />
                ))}
              </div>
            ) : (
              <ListPlaceholder>
                No one has shared a tag with you
              </ListPlaceholder>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default SharedTagList;
