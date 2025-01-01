import React from "react";
import SingleInputForm from "./single-input-form";
import useMutations from "@/hooks/use-mutations";
import type { ListSelect } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { listsQueryOptions } from "@/lib/queries";
import QueryGuard from "./base/query-guard";
import UserBubbleGroup from "./base/user-bubble-group";
import useConfirmButton from "@/hooks/use-confirm-button";
import UserBubble from "./base/user-bubble";
import DeleteButton from "./ui/delete-button";
import { cn } from "@/lib/utils";
import { useEventListener } from "usehooks-ts";
import { Box, Button, Dialog, Grid, Text, Tooltip } from "@radix-ui/themes";

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
        <Text className="text-xs">Update name</Text>
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
          <Text className="text-xs">Share with</Text>
          <div className="rounded bg-secondary/20 min-h-12 overflow-y-auto px-2">
            <div className="grid divide-y">
              {list.shares.map((share) => (
                <div className="text-sm flex items-center gap-2 py-2">
                  <UserBubble user={share.user} size="md" />
                  <div className="grid flex-1 gap-0.5">
                    <span>{share.user.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {share.user.email}
                    </span>
                  </div>
                  {share.isPending && (
                    <Tooltip side="left" content="Pending Invitation">
                      <i className="fa-solid fa-hourglass text-muted-foreground" />
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
                <div className="text-xs text-muted-foreground flex h-12 items-center justify-center">
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

      <Button ref={ref} size="1" {...buttonProps}>
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
        "hover:bg-secondary/20 grid gap-2 px-3",
        isOpen && "bg-secondary/20",
      )}
    >
      <Button
        variant="ghost"
        className="flex items-center justify-between gap-2 py-2"
        onClick={() => setOpen(!isOpen)}
      >
        <div className="text-sm flex items-center gap-2">
          <span className="font-semibold">{list.name}</span>
          <UserBubbleGroup users={list.otherUsers} numAvatars={10} />
          {list.isAuthor && (
            <i className="fa-solid fa-star text-sm text-primary/50" />
          )}
        </div>
        <div className="text-xs flex size-6 items-center justify-center">
          <i
            className={cn(
              "fa-solid fa-chevron-right transition-transform",
              isOpen && "rotate-90",
            )}
          />
        </div>
      </Button>
      {isOpen && (
        <div className="grid pb-3">
          <ListContent list={list} />
        </div>
      )}
    </div>
  );
};

const ListsEditor: React.FC<{
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}> = ({ isOpen, setIsOpen }) => {
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
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Content>
        <Grid gap="4">
          <Grid>
            <Dialog.Title>Manage your lists</Dialog.Title>
            <Dialog.Description>
              Add, remove, edit and share your lists
            </Dialog.Description>
          </Grid>
          <Box
            maxHeight="50vh"
            minHeight="150px"
            overflowY="auto"
            style={{
              backgroundColor: "var(--gray-3)",
              borderRadius: "var(--radius-3)",
            }}
            className="rounded-lg bg-secondary/20 border"
          >
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
          </Box>
          <Grid gap="2">
            <Text weight="bold" size="2">
              Add a List
            </Text>
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
          </Grid>
        </Grid>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default ListsEditor;
