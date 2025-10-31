import React from "react";
import Empty from "../ui/empty";
import { Button, Card, Heading } from "@radix-ui/themes";
import { CheckIcon, HourglassIcon, XIcon } from "lucide-react";
import useMutations from "@/app/hooks/use-mutations";
import { getRouteApi } from "@tanstack/react-router";
import UserRow from "../ui/user/user-row";

const route = getRouteApi("/todos/$listId");

const PendingListScreen: React.FC = () => {
  const { listId } = route.useParams();
  const { list } = route.useLoaderData();

  const { acceptListJoin, removeSelfFromList } = useMutations();

  const handleAcceptJoin = () => acceptListJoin.mutate({ listId });
  const handleDeclineJoin = () => removeSelfFromList.mutate({ listId });

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
          <Button variant="soft" className="h-9" onClick={handleDeclineJoin}>
            <XIcon className="size-4" />
            Decline
          </Button>
          <Button variant="solid" className="h-9" onClick={handleAcceptJoin}>
            <CheckIcon className="size-4" />
            Join
          </Button>
        </div>
      </Empty.Content>
      <Card size="2" className="grid w-full max-w-sm gap-4">
        <Heading as="h4" size="1" color="gray" className="uppercase">
          List Users
        </Heading>
        {list.otherUsers.map((user) => (
          <UserRow key={user.id} user={user} />
        ))}
      </Card>
    </Empty.Root>
  );
};

export default PendingListScreen;
