import React from "react";
import Empty from "../ui/empty";
import { CheckIcon } from "lucide-react";

const NoTodosScreen: React.FC = () => {
  return (
    <Empty.Root>
      <Empty.Header>
        <Empty.Media variant="icon">
          <CheckIcon />
        </Empty.Media>
        <Empty.Title>Nothing to do</Empty.Title>
        <Empty.Description>
          All caught up! You have no todos at the moment.
        </Empty.Description>
      </Empty.Header>
    </Empty.Root>
  );
};

export default NoTodosScreen;
