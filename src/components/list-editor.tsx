import React from "react";
import useMutations from "@/hooks/use-mutations";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { listsQueryOptions, userByEmailQueryOptions } from "@/lib/queries";
import UserBubble from "./base/user-bubble";
import DeleteButton from "./base/delete-button";
import { useDebounceValue, useEventListener } from "usehooks-ts";
import {
  Badge,
  Button,
  Callout,
  Heading,
  IconButton,
  Spinner,
  Strong,
  Text,
  TextField,
  Tooltip,
} from "@radix-ui/themes";
import useSelectedList from "@/hooks/use-selected-list";
import useConfirmDialog from "@/hooks/use-confirm-dialog";
import ResponsiveModal from "./base/responsive-modal";

const getIcon = (query: UseQueryResult<boolean, Error>): React.ReactNode => {
  if (query.isLoading) {
    return <Spinner loading />;
  }

  if (query.status === "success" && query.data) {
    return (
      <Tooltip content="User exists" side="right">
        <Text color="green">
          <i className="fa-solid fa-circle-check" />
        </Text>
      </Tooltip>
    );
  }
  if (query.status === "error" || query.data === false) {
    return (
      <Tooltip content="User does not exist" side="right">
        <Text color="red">
          <i className="fa-solid fa-circle-xmark" />
        </Text>
      </Tooltip>
    );
  }
  return (
    <Spinner loading={query.isLoading}>
      <i className="fa-solid fa-at" />
    </Spinner>
  );
};

const ListEditor: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const {
    deleteListShare,
    createListShare,
    leaveListShare,
    updateList,
    deleteList,
  } = useMutations();

  const [DeleteDialog, confirmDelete] = useConfirmDialog({
    title: "Delete List",
    description:
      "This action is irreversible and will permanently delete this list and all of its contents for all users.",
  });

  const [LeaveDialog, confirmLeave] = useConfirmDialog({
    title: "Leave List",
    description:
      "This action will remove you from this list and you will no longer be able to view or edit it.",
  });

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
    setIsOpen(false);
  }, [list]);

  if (!list) return null;

  return (
    <>
      <LeaveDialog />
      <DeleteDialog />
      <Tooltip content={`Edit ${list.name}`} side="left">
        <IconButton
          radius="full"
          size="3"
          variant="soft"
          className="fixed bottom-8 right-8"
          onClick={() => setIsOpen(true)}
        >
          <i className="fa-solid fa-pen" />
        </IconButton>
      </Tooltip>
      <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
        <header>
          <Heading as="h2" size="3">
            Edit {list.name}
          </Heading>
          <Text size="2" color="gray">
            Edit, share, or delete this list
          </Text>
        </header>
        <Callout.Root>
          <Callout.Icon>
            <UserBubble user={list.author} size="md" />
          </Callout.Icon>
          <Callout.Text>
            Created by <Strong>{list.author.name}</Strong>
          </Callout.Text>
        </Callout.Root>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateList.mutate({ id: list.id, data: { name } });
          }}
          className="grid gap-rx-2"
        >
          <Text as="label" size="2" weight="bold">
            Update Name
          </Text>
          <div className="grid grid-cols-[1fr_6rem] gap-rx-2">
            <TextField.Root
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1"
              placeholder="New List"
            />
            <Button
              variant="surface"
              type="submit"
              disabled={name === list.name}
            >
              <i className="fa-solid fa-save" />
              Update
            </Button>
          </div>
        </form>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!sharedUserQuery.data) return;
            createListShare.mutate({ listId: list.id, email });
            e.currentTarget.reset();
            setEmail("");
          }}
          className="grid gap-rx-2"
        >
          <Text as="label" size="2" weight="bold">
            Share with
          </Text>
          <div className="grid grid-cols-[1fr_6rem] gap-rx-2">
            <TextField.Root
              className="flex-1"
              placeholder="cool_collaborator@hotmail.com"
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
              <i className="fa-solid fa-paper-plane" />
              Invite
            </Button>
          </div>
          <div className="min-h-12 overflow-y-auto rounded-3 border bg-panel-translucent px-2">
            <div className="grid divide-y">
              {list.shares.map((share) => (
                <div key={share.id} className="flex items-center gap-rx-3 py-2">
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
                      <Badge color="amber" size="3">
                        <i className="fa-solid fa-hourglass" />
                      </Badge>
                    </Tooltip>
                  )}
                  {list.isAuthor && (
                    <DeleteButton
                      handleDelete={() =>
                        deleteListShare.mutate({ id: share.id })
                      }
                    />
                  )}
                </div>
              ))}
              {list.shares.length === 0 && (
                <Text size="2" color="gray" align="center" className="p-6">
                  No shares
                </Text>
              )}
            </div>
          </div>
        </form>
        {list.isAuthor ? (
          <Button
            variant="soft"
            color="red"
            onClick={async () => {
              const ok = await confirmDelete();
              if (ok) {
                deleteList.mutate({ id: list.id });
              }
            }}
          >
            <i className="fa-solid fa-trash" />
            Delete List
          </Button>
        ) : (
          <Button
            variant="soft"
            color="amber"
            onClick={async () => {
              const ok = await confirmLeave();
              if (ok) {
                leaveListShare.mutate({ listId: list.id });
              }
            }}
          >
            <i className="fa-solid fa-arrow-right-from-bracket" />
            Leave List
          </Button>
        )}
      </ResponsiveModal>
    </>
  );
};

export default ListEditor;
