import React from "react";
import Empty from "../ui/empty";
import { Button } from "@radix-ui/themes";
import { CircleQuestionMarkIcon, ListPlusIcon } from "lucide-react";
import useAlerts from "@/app/hooks/use-alerts";

const NoListsScreen: React.FC = () => {
  const { handleCreateList } = useAlerts();

  return (
    <Empty.Root>
      <Empty.Header>
        <Empty.Media variant="icon">
          <CircleQuestionMarkIcon />
        </Empty.Media>
        <Empty.Title>No lists created</Empty.Title>
        <Empty.Description>
          You haven't created any lists yet. Start by adding a new list to
          organize your tasks.
        </Empty.Description>
      </Empty.Header>
      <Empty.Content>
        <Button onClick={handleCreateList}>
          <ListPlusIcon className="size-4" />
          New List
        </Button>
      </Empty.Content>
    </Empty.Root>
  );
};

export default NoListsScreen;
