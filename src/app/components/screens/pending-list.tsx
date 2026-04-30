import React from "react";
import Empty from "../ui/empty";
import { Button, Card, Heading } from "@radix-ui/themes";
import { CheckIcon, HourglassIcon, XIcon } from "lucide-react";
import { getRouteApi } from "@tanstack/react-router";
import UserRow from "../ui/user/user-row";
import useLeaveList from "@/app/hooks/actions/use-leave-list";
import useAcceptInvite from "@/app/hooks/actions/use-accept-invite";
import useGetList from "@/app/hooks/actions/use-get-list";
import NotFoundScreen from "./not-found";
import useGetListUsers from "@/app/hooks/actions/use-get-list-users";
import * as collections from "@/app/lib/collections";

const route = getRouteApi("/todos/$listId");

const PendingListScreen: React.FC = () => {
  const { listId } = route.useParams();
  const list = useGetList(listId);
  const listUsers = useGetListUsers(listId);

  if (!list) return <NotFoundScreen />;

  const { handleLeaveList } = useLeaveList();
  const { handleAcceptListInvite } = useAcceptInvite();

  return (
    <Empty.Root>
      <Empty.Header>
        <Empty.Media variant="icon">
          <HourglassIcon />
        </Empty.Media>
        <Empty.Title>You are invited to {list.name}</Empty.Title>
        <Empty.Description>
          Do you want to join this list? Any todos you add will be visible to
          all members of the list.
        </Empty.Description>
      </Empty.Header>
      <Empty.Content>
        <div className="grid w-full max-w-2xs grid-cols-2 gap-2">
          <Button
            variant="soft"
            className="h-9"
            onClick={() => handleLeaveList(listId)}
          >
            <XIcon className="size-4" />
            Decline
          </Button>
          <Button
            variant="solid"
            className="h-9"
            onClick={() => handleAcceptListInvite(listId)}
          >
            <CheckIcon className="size-4" />
            Join
          </Button>
        </div>
      </Empty.Content>
      <Card size="2" className="grid w-full max-w-2xs gap-4">
        <Heading as="h4" size="1" color="gray" className="uppercase">
          List Members
        </Heading>
        {listUsers.map((user) => (
          <UserRow key={user.id} user={user} />
        ))}
      </Card>
    </Empty.Root>
  );
};

export default PendingListScreen;
