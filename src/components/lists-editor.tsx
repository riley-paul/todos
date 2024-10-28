import React from "react";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import SingleInputForm from "./single-input-form";
import { Label } from "./ui/label";
import useMutations from "@/hooks/use-mutations";
import type { ListSelect } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { listsQueryOptions } from "@/lib/queries";
import QueryGuard from "./base/query-guard";
import UserBubbleGroup from "./base/user-bubble-group";
import { Button } from "./ui/button";
import useConfirmButton from "@/hooks/use-confirm-button";
import ResponsiveModal from "@/components/responsive-modal";
import UserBubble from "./base/user-bubble";
import DeleteButton from "./ui/delete-button";
import { cn } from "@/lib/utils";
import { useAtom } from "jotai";
import { listsEditorOpenAtom } from "@/lib/store";
import { useEventListener } from "usehooks-ts";

const ListContent: React.FC<{ list: ListSelect }> = ({ list }) => {
  const {
    updateList,
    leaveListShare,
    deleteListShare,
    deleteList,
    createListShare,
  } = useMutations();

  const { ref, buttonProps, isConfirming } = useConfirmButton({
    handleConfirm: () =>
      list.isAuthor
        ? deleteList.mutate({ id: list.id })
        : leaveListShare.mutate({ listId: list.id }),
  });

  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label className="text-xs">Update name</Label>
        <SingleInputForm
          placeholder="Enter list name"
          initialValue={list.name}
          handleSubmit={(name) =>
            updateList.mutate({ id: list.id, data: { name } })
          }
        />
      </div>
      {list.isAuthor && (
        <div className="grid gap-2">
          <Label className="text-xs">Share with</Label>
          <div className="min-h-12 overflow-y-auto rounded bg-secondary/20 px-2">
            <div className="grid divide-y">
              {list.shares.map((share) => (
                <div className="flex items-center gap-2 py-2 text-sm">
                  <UserBubble user={share.user} size="md" />
                  <div className="grid flex-1 gap-0.5">
                    <span>{share.user.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {share.user.email}
                    </span>
                  </div>
                  {share.isPending && (
                    <Tooltip>
                      <TooltipTrigger>
                        <i className="fa-solid fa-hourglass text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent side="left">
                        Pending invitation
                      </TooltipContent>
                    </Tooltip>
                  )}
                  <DeleteButton
                    handleDelete={() =>
                      deleteListShare.mutate({ id: share.id })
                    }
                  />
                </div>
              ))}
              {list.shares.length === 0 && (
                <div className="flex h-12 items-center justify-center text-xs text-muted-foreground">
                  No shares
                </div>
              )}
            </div>
          </div>
          <SingleInputForm
            size="sm"
            placeholder="Enter email"
            button={{
              icon: <i className="fa-solid fa-paper-plane" />,
              string: "Invite",
              variant: "outline",
            }}
            initialValue=""
            handleSubmit={(email) =>
              createListShare.mutate({ listId: list.id, email })
            }
            isUserEmail
            clearAfterSubmit
          />
        </div>
      )}

      <Button ref={ref} size="sm" {...buttonProps}>
        {isConfirming ? (
          "Are you sure?"
        ) : list.isAuthor ? (
          <>
            <i className="fa-solid fa-trash mr-2" />
            <span>Delete list</span>
          </>
        ) : (
          <>
            <i className="fa-solid fa-door-open mr-2" />
            <span>Leave list</span>
          </>
        )}
      </Button>
    </div>
  );
};

const ListContainer: React.FC<{
  list: ListSelect;
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
}> = ({ list, isOpen, setOpen }) => {
  return (
    <div
      className={cn(
        "grid gap-2 px-3 hover:bg-secondary/20",
        isOpen && "bg-secondary/20",
      )}
    >
      <button
        className="flex items-center justify-between gap-2 py-2"
        onClick={() => setOpen(!isOpen)}
      >
        <div className="flex items-center gap-2 text-sm">
          <span className="font-semibold">{list.name}</span>
          <UserBubbleGroup users={list.otherUsers} numAvatars={10} />
          {list.isAuthor && (
            <i className="fa-solid fa-star text-sm text-primary/50" />
          )}
        </div>
        <div className="flex size-6 items-center justify-center text-xs">
          <i
            className={cn(
              "fa-solid fa-chevron-right transition-transform",
              isOpen && "rotate-90",
            )}
          />
        </div>
      </button>
      {isOpen && (
        <div className="grid pb-3">
          <ListContent list={list} />
        </div>
      )}
    </div>
  );
};

const ListsEditor: React.FC = () => {
  const [isOpen, setIsOpen] = useAtom(listsEditorOpenAtom);

  useEventListener("keydown", (e) => {
    if (e.key === "e" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      setIsOpen(true);
    }
  });

  const listsQuery = useQuery(listsQueryOptions);
  const { createList } = useMutations();

  const [openList, setOpenList] = React.useState("");

  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <DialogHeader>
        <DialogTitle>Manage your lists</DialogTitle>
        <DialogDescription>
          Add, remove, edit and share your lists
        </DialogDescription>
      </DialogHeader>
      <div className="max-h-[50vh] min-h-[150px] overflow-y-auto rounded-lg border bg-secondary/20">
        <QueryGuard query={listsQuery}>
          {(lists) => (
            <div className="grid divide-y">
              {lists.map((list) => (
                <ListContainer
                  key={list.id}
                  list={list}
                  isOpen={openList === list.id}
                  setOpen={(open) => setOpenList(open ? list.id : "")}
                />
              ))}
            </div>
          )}
        </QueryGuard>
      </div>
      <div className="grid gap-2">
        <Label>Add a List</Label>
        <SingleInputForm
          clearAfterSubmit
          initialValue=""
          placeholder="Enter list name"
          button={{
            icon: <i className="fa-solid fa-plus" />,
            string: "Add list",
            variant: "default",
          }}
          handleSubmit={(name) => {
            createList.mutate({ name });
            setOpenList("");
          }}
        />
      </div>
    </ResponsiveModal>
  );
};

export default ListsEditor;
