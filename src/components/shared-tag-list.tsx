import React from "react";

import { useQuery } from "@tanstack/react-query";
import { sharedTagsQueryOptions } from "@/lib/queries";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import useMutations from "@/hooks/use-mutations";
import DeleteButton from "./ui/delete-button";
import HashtagLink from "./hashtag-link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

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

const SharedTagList: React.FC = () => {
  const { data = [] } = useQuery(sharedTagsQueryOptions);

  const pendingTags = data.filter(({ SharedTag: { isPending } }) => isPending);
  const sharedTags = data.filter(({ SharedTag: { isPending } }) => !isPending);

  const { deleteSharedTag } = useMutations();

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <span>Shared Tags</span>
          <i className="fa-solid fa-tag ml-2 text-primary" />
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2">
        <ListHeader>Shared by you</ListHeader>
        {sharedTags.length > 0 ? (
          <Table>
            <TableBody>
              {sharedTags.map((tag) => (
                <TableRow>
                  <TableCell>
                    <HashtagLink
                      tag={tag.SharedTag.tag}
                      string={tag.SharedTag.tag}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="flex h-full items-center justify-end gap-2 text-muted-foreground">
                      {tag.User.name}
                      <Avatar className="size-5">
                        <AvatarImage src={tag.User.avatarUrl ?? ""} />
                        <AvatarFallback>
                          {tag.User.name.slice(0, 1).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </span>
                  </TableCell>
                  <TableCell className="w-4">
                    <DeleteButton
                      handleDelete={() =>
                        deleteSharedTag.mutate({ id: tag.SharedTag.id })
                      }
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <ListPlaceholder>Nothing yet</ListPlaceholder>
        )}

        <ListHeader>Shared with you</ListHeader>
        {pendingTags.length > 0 ? (
          <Table>
            <TableBody>
              {pendingTags.map((tag) => (
                <TableRow>
                  <TableCell>
                    <HashtagLink
                      tag={tag.SharedTag.tag}
                      string={tag.SharedTag.tag}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="flex h-full items-center justify-end gap-2 text-muted-foreground">
                      {tag.User.name}
                      <Avatar className="size-5">
                        <AvatarImage src={tag.User.avatarUrl ?? ""} />
                        <AvatarFallback>
                          {tag.User.name.slice(0, 1).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </span>
                  </TableCell>
                  <TableCell className="w-4">
                    <DeleteButton
                      handleDelete={() =>
                        deleteSharedTag.mutate({ id: tag.SharedTag.id })
                      }
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <ListPlaceholder>Nothing yet</ListPlaceholder>
        )}
      </CardContent>
    </Card>
  );
};

export default SharedTagList;
