import React from "react";
import useMutations from "@/hooks/use-mutations";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { listsQueryOptions, userByEmailQueryOptions } from "@/lib/queries";
import UserBubble from "./base/user-bubble";
import DeleteButton from "./base/delete-button";
import { useDebounceValue, useEventListener } from "usehooks-ts";
import {
  Button,
  IconButton,
  Spinner,
  Text,
  TextField,
  Tooltip,
} from "@radix-ui/themes";
import VaulDrawer from "./base/vaul-drawer";
import {
  AtSign,
  CircleCheck,
  CircleX,
  Hourglass,
  NotebookTabs,
  Save,
  Send,
} from "lucide-react";
import useSelectedList from "@/hooks/use-selected-list";

const getIcon = (query: UseQueryResult<boolean, Error>): React.ReactNode => {
  if (query.isLoading) {
    return <Spinner loading />;
  }

  if (query.status === "success" && query.data) {
    return (
      <Tooltip content="User exists" side="right">
        <Text color="green">
          <CircleCheck className="size-4" />
        </Text>
      </Tooltip>
    );
  }
  if (query.status === "error" || query.data === false) {
    return (
      <Tooltip content="User does not exist" side="right">
        <Text color="red">
          <CircleX className="size-4" />
        </Text>
      </Tooltip>
    );
  }
  return (
    <Spinner loading={query.isLoading}>
      <AtSign className="size-4" />
    </Spinner>
  );
};

const ListEditor: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const { deleteListShare, createListShare } = useMutations();

  const { selectedList } = useSelectedList();
  const listsQuery = useQuery(listsQueryOptions);
  const list = listsQuery.data?.find((list) => list.id === selectedList);

  useEventListener("keydown", (e) => {
    if (e.key === "e" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      setIsOpen(true);
    }
  });

  const [name, setName] = React.useState(list?.name ?? "");
  const [email, setEmail] = useDebounceValue("", 500);

  const sharedUserQuery = useQuery({
    ...userByEmailQueryOptions(email),
    enabled: email.length > 0,
  });

  React.useEffect(() => {
    setName(list?.name ?? "");
    setEmail("");
  }, [list]);

  if (!list) return null;

  return (
    <>
      <Tooltip content={`Edit ${list.name}`} side="left">
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
              value={name}
              onChange={(e) => setName(e.target.value)}
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
          <form
            className="flex gap-rx-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (!sharedUserQuery.data) return;
              createListShare.mutate({ listId: list.id, email });
            }}
          >
            <TextField.Root
              className="flex-1"
              placeholder="New List"
              onChange={(e) => setEmail(e.target.value)}
            >
              <TextField.Slot side="left">
                {getIcon(sharedUserQuery)}
              </TextField.Slot>
            </TextField.Root>
            <Button
              type="submit"
              variant="surface"
              disabled={!sharedUserQuery.data}
              onClick={() => createListShare.mutate({ listId: list.id, email })}
            >
              <Send className="size-4" />
              Invite
            </Button>
          </form>
          <div className="mt-2 min-h-12 overflow-y-auto rounded-3 border border-gray-7 bg-panel-translucent px-2">
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
                      <Text color="amber">
                        <Hourglass className="size-4" />
                      </Text>
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
                <Text size="2" color="gray" align="center" className="p-6">
                  No shares
                </Text>
              )}
            </div>
          </div>
        </div>
      </VaulDrawer>
    </>
  );
};

export default ListEditor;
