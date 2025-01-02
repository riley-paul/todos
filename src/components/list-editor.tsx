import React from "react";
import useMutations from "@/hooks/use-mutations";
import { useQuery } from "@tanstack/react-query";
import { listsQueryOptions } from "@/lib/queries";
import UserBubble from "./base/user-bubble";
import DeleteButton from "./base/delete-button";
import { useEventListener } from "usehooks-ts";
import { Button, IconButton, Text, TextField, Tooltip } from "@radix-ui/themes";
import VaulDrawer from "./base/vaul-drawer";
import { NotebookTabs, Save, Send } from "lucide-react";
import useSelectedList from "@/hooks/use-selected-list";

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
