import React from "react";
import Empty from "../ui/empty";
import { Spinner } from "@radix-ui/themes";

const LoadingScreen: React.FC = () => {
  return (
    <Empty.Root className="absolute inset-0">
      <Empty.Media>
        <Spinner size="3" />
      </Empty.Media>
    </Empty.Root>
  );
};

export default LoadingScreen;
