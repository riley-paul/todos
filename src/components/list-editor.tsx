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
import { useEventListener } from "usehooks-ts";
import { Button, IconButton, Text, TextField, Tooltip } from "@radix-ui/themes";
import VaulDrawer from "./base/vaul-drawer";
import { NotebookTabs, Save, Send, Share2 } from "lucide-react";
import useSelectedList from "@/hooks/use-selected-list";

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

const ListEditor: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const { deleteListShare } = useMutations();

  const { selectedList } = useSelectedList();
  const listsQuery = useQuery(listsQueryOptions);
  const list = listsQuery.data?.find((list) => list.id === selectedList);

  useEventListener("keydown", (e) => {
    if (e.key === "e" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      setIsOpen(true);
    }
  });

  if (!list) return null;

  return (
    <>
      <Tooltip content="Edit List" side="left">
        <IconButton
          radius="full"
          size="3"
          variant="soft"
          color="gray"
          className="fixed bottom-8 right-8"
          onClick={() => setIsOpen(true)}
        >
          <NotebookTabs className="size-5" />
        </IconButton>
      </Tooltip>
      <VaulDrawer
        title={`Edit ${list.name}`}
        description="Edit, share, or delete this list"
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      >
        <div className="grid gap-rx-2">
          <Text asChild size="2" weight="bold">
            <label>Update Name</label>
          </Text>
          <div className="flex gap-rx-2">
            <TextField.Root
              value={list.name}
              className="flex-1"
              placeholder="New List"
            />
            <Button variant="surface">
              <Save className="size-4" />
              Update
            </Button>
          </div>
        </div>
        <div className="grid gap-rx-2">
          <Text asChild size="2" weight="bold">
            <label>Share with</label>
          </Text>
          <div className="flex gap-rx-2">
            <TextField.Root
              value={list.name}
              className="flex-1"
              placeholder="New List"
            />
            <Button variant="surface">
              <Send className="size-4" />
              Invite
            </Button>
          </div>
          <div className="min-h-12 overflow-y-auto rounded-3 border border-gray-7 bg-panel-translucent px-2">
            <div className="grid divide-y">
              {list.shares.map((share) => (
                <div className="flex items-center gap-rx-3 border-gray-6 py-2">
                  <UserBubble user={share.user} size="md" />
                  <div className="grid flex-1 gap-0.5">
                    <Text size="2" weight="medium">
                      {share.user.name}
                    </Text>
                    <Text size="2" color="gray">
                      {share.user.email}
                    </Text>
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
        </div>
        {list.name}
      </VaulDrawer>
    </>
  );
};

export default ListEditor;
