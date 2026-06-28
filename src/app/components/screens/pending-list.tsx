import React from "react";
import Empty from "../ui/empty";
import { Button, Card, Heading } from "@radix-ui/themes";
import { CheckIcon, HourglassIcon, XIcon } from "lucide-react";
import UserRow from "../ui/user/user-row";
import NotFoundScreen from "./not-found";
import useManageListUsers from "@/app/hooks/actions/use-manage-list-users";
import type { ShallowListFragment } from "@/app/gql.gen";
import useNonPendingListUsers from "@/app/hooks/actions/use-non-pending-list-users";

type Props = { list: ShallowListFragment };

const PendingListScreen: React.FC<Props> = ({ list }) => {
  if (!list) return <NotFoundScreen />;

  const nonPendingUsers = useNonPendingListUsers(list);
  const { handleLeaveList, handleAcceptInvite } = useManageListUsers(list.id);

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
          <Button variant="soft" className="h-9" onClick={handleLeaveList}>
            <XIcon className="size-4" />
            Decline
          </Button>
          <Button variant="solid" className="h-9" onClick={handleAcceptInvite}>
            <CheckIcon className="size-4" />
            Join
          </Button>
        </div>
      </Empty.Content>
      <Card size="2" className="grid w-full max-w-2xs gap-4">
        <Heading as="h4" size="1" color="gray" className="uppercase">
          List Members
        </Heading>
        {nonPendingUsers.map((user) => (
          <UserRow key={user.id} user={user} />
        ))}
      </Card>
    </Empty.Root>
  );
};

export default PendingListScreen;
