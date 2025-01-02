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
import { Button, Text, Tooltip } from "@radix-ui/themes";
import VaulDrawer from "./base/vaul-drawer";
import { Share2 } from "lucide-react";
import { Drawer } from "vaul";

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
  setIsOpen: (isOpen: boolean) => void;
}> = ({ list, isOpen, setIsOpen }) => {
  return (
    <>
      <div className="flex items-center justify-between gap-rx-2 border-gray-6 px-rx-3 py-rx-1">
        <div className="flex items-center gap-2">
          <Text size="2">{list.name}</Text>
          <UserBubbleGroup users={list.otherUsers} numAvatars={10} />
          {!list.isAuthor && <Share2 className="size-4" />}
        </div>
        <div className="flex items-center gap-rx-2">
          {list.isAuthor && (
            <Button size="1" variant="surface" onClick={() => setIsOpen(true)}>
              Edit
            </Button>
          )}
          <Button size="1" color="red" variant="soft">
            {list.isAuthor ? "Delete" : "Leave"}
          </Button>
        </div>
      </div>
    </>
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
    <VaulDrawer
      title="Manage your lists"
      description="Add, remove, edit and share your lists"
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    >
      <div className="min-h-150px grid max-h-[50vh] overflow-y-auto rounded-3 border border-gray-7 bg-panel-translucent">
        <QueryGuard query={listsQuery}>
          {(lists) => (
            <div className="grid divide-y">
              {lists.map((list) => (
                <ListContainer
                  key={list.id}
                  list={list}
                  isOpen={openList === list.id}
                  setIsOpen={(open) =>
                    open ? setOpenList(list.id) : setOpenList("")
                  }
                />
              ))}
            </div>
          )}
        </QueryGuard>
      </div>
    </VaulDrawer>
  );
};

export default ListsEditor;
