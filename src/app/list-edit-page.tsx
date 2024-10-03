import { Button } from "@/components/ui/button";
import useConfirmButton from "@/hooks/use-confirm-button";
import useMutations from "@/hooks/use-mutations";
import React from "react";
import { useParams } from "react-router-dom";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import PageHeader from "@/components/page-header";
import { useQuery } from "@tanstack/react-query";
import { listQueryOptions } from "@/lib/queries";
import QueryGuard from "@/components/query-guard";
import ConditionalValueEditor from "@/components/conditional-value-editor";
import DeleteButton from "@/components/ui/delete-button";
import { Label } from "@/components/ui/label";
import VerifiedEmailInput from "@/components/verified-email-input";
import invariant from "tiny-invariant";

const ListEdit: React.FC = () => {
  const { listId = "" } = useParams();

  const {
    deleteList,
    updateList,
    createListShare,
    deleteListShare,
    leaveListShare,
  } = useMutations();

  const listQuery = useQuery(listQueryOptions(listId));

  const deleteConfirm = useConfirmButton({
    handleConfirm: () => deleteList.mutate({ id: listId }),
  });

  const leaveConfirm = useConfirmButton({
    handleConfirm: () => leaveListShare.mutate({ listId }),
  });

  const emailInputRef = React.useRef<HTMLInputElement>(null);
  const [email, setEmail] = React.useState("");
  const [valid, setValid] = React.useState(false);

  return (
    <QueryGuard query={listQuery}>
      {(list) => (
        <div className="grid gap-8 px-3">
          <div className="grid gap-1">
            <PageHeader title="Edit List" backLink={`/list/${listId}`} />
            {list.isAdmin ? (
              <ConditionalValueEditor
                initialValue={list.name}
                displayClassName="text-2xl font-bold leading-tight"
                saveValue={(name) =>
                  updateList.mutate({ id: listId, data: { name } })
                }
              />
            ) : (
              <h2 className="flex h-10 items-center text-2xl font-bold leading-tight">
                {list.name}
              </h2>
            )}
            <div className="text-xs text-muted-foreground">
              Created by {list.listAdmin.name}
            </div>
          </div>

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
                  {list.isAdmin && (
                    <DeleteButton
                      handleDelete={() =>
                        deleteListShare.mutate({ id: share.id })
                      }
                    />
                  )}
                </div>
              ))}
              {list.shares.length === 0 && (
                <div className="flex h-[54px] items-center justify-center px-2 text-xs text-muted-foreground">
                  No one else has access to this list
                </div>
              )}
            </div>

            {list.isAdmin && (
              <form
                onSubmit={(e) => {
                  const input = emailInputRef.current;
                  invariant(input);

                  e.preventDefault();
                  if (!valid) return;
                  createListShare.mutate({ listId, email });
                  input.value = "";
                }}
                className="grid grid-cols-[1fr_auto] items-center gap-2"
              >
                <VerifiedEmailInput
                  ref={emailInputRef}
                  setValue={(email) => setEmail(email)}
                  setValid={(valid) => setValid(valid)}
                  inputProps={{ placeholder: "Share list by email..." }}
                />
                <input type="submit" hidden />
                <Button type="submit" variant="ghost" disabled={!valid}>
                  <i className="fa-solid fa-paper-plane mr-2" />
                  <span>Share</span>
                </Button>
              </form>
            )}
          </div>

          {list.isAdmin ? (
            <Button
              size="sm"
              ref={deleteConfirm.ref}
              {...deleteConfirm.buttonProps}
            >
              <span>
                {deleteConfirm.isConfirming ? "You're sure?" : "Delete"}
              </span>
            </Button>
          ) : (
            <Button
              size="sm"
              ref={leaveConfirm.ref}
              {...leaveConfirm.buttonProps}
            >
              <span>
                {leaveConfirm.isConfirming ? "You're sure?" : "Leave"}
              </span>
            </Button>
          )}
        </div>
      )}
    </QueryGuard>
  );
};

export default ListEdit;
