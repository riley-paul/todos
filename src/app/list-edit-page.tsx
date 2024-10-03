import { Button, buttonVariants } from "@/components/ui/button";
import useDeleteButton from "@/hooks/use-delete-button";
import useMutations from "@/hooks/use-mutations";
import React from "react";
import { Link, useParams } from "react-router-dom";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import PageHeader from "@/components/page-header";
import ServerInput from "@/components/server-input";
import { useQuery } from "@tanstack/react-query";
import { listQueryOptions } from "@/lib/queries";
import QueryGuard from "@/components/query-guard";
import ConditionalValueEditor from "@/components/conditional-value-editor";
import DeleteButton from "@/components/ui/delete-button";
import { Label } from "@/components/ui/label";

const ListEdit: React.FC = () => {
  const { listId = "" } = useParams();

  const { deleteList, updateList } = useMutations();

  const listQuery = useQuery(listQueryOptions(listId));

  const {
    ref: deleteRef,
    isConfirming,
    handleClick,
  } = useDeleteButton({
    handleDelete: () => deleteList.mutate({ id: listId ?? "" }),
  });

  return (
    <QueryGuard query={listQuery}>
      {(list) => (
        <div className="grid gap-6 px-3">
          <PageHeader title={`Update ${list.name}`} />

          <ConditionalValueEditor
            initialValue={list.name}
            displayClassName="text-2xl font-bold leading-tight"
            saveValue={(name) =>
              updateList.mutate({ id: listId, data: { name } })
            }
          />
          <div>Created by {list.listAdmin.name}</div>

          <ServerInput
            placeholder="List name..."
            currentValue={list.name}
            onUpdate={(name) =>
              updateList.mutate({ id: listId, data: { name } })
            }
          />

          <div className="grid gap-3">
            <Label>Shared With</Label>
            <div className="divide-y border-y">
              {list.shares.map((share) => (
                <div
                  key={share.id}
                  className="flex items-center gap-2 px-2 py-2 text-sm transition-colors hover:bg-muted/50"
                >
                  <Avatar className="size-8">
                    <AvatarImage src={share.user.avatarUrl ?? ""} />
                    <AvatarFallback>
                      {share.user.name.slice(1).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 gap-0.5">
                    <span>{share.user.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {share.user.email}
                    </span>
                  </div>
                  {share.isPending && (
                    <Tooltip>
                      <TooltipTrigger>
                        <i className="fa-solid fa-hourglass text-xs text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent side="left" sideOffset={8}>
                        Request is pending
                      </TooltipContent>
                    </Tooltip>
                  )}
                  <DeleteButton handleDelete={() => {}} />
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              ref={deleteRef}
              variant={isConfirming ? "destructive" : "secondary"}
              onClick={handleClick}
            >
              {isConfirming && <i className="fa-solid fa-trash mr-2" />}
              <span>{isConfirming ? "Confirm?" : "Delete list"}</span>
            </Button>
            <Link to={`/list/${listId}`} className={buttonVariants()}>
              <i className="fa-solid fa-check mr-2" />
              <span>Done</span>
            </Link>
          </div>
        </div>
      )}
    </QueryGuard>
  );
};

export default ListEdit;
