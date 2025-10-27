import React from "react";
import Empty from "../ui/empty";
import { Button, Text } from "@radix-ui/themes";
import { CheckIcon, HourglassIcon, XIcon } from "lucide-react";
import useMutations from "@/app/hooks/use-mutations";
import { getRouteApi } from "@tanstack/react-router";
import UserBubble from "../ui/user-bubble";

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
        <div className="flex items-center gap-2">
          <Button
            color="red"
            variant="soft"
            className="h-9"
            onClick={handleDeclineJoin}
          >
            <XIcon className="size-4" />
            Decline
          </Button>
          <Button variant="solid" className="h-9" onClick={handleAcceptJoin}>
            <CheckIcon className="size-4" />
            Join
          </Button>
        </div>
      </Empty.Content>
      <div className="grid max-w-sm gap-4 pt-6">
        {list.otherUsers.map((user) => (
          <div key={user.id} className="flex items-center gap-2">
            <UserBubble user={user} avatarProps={{ size: "1" }} />
            <Text weight="medium">{user.name}</Text>
          </div>
        ))}
      </div>
    </Empty.Root>
  );
};

export default PendingListScreen;
