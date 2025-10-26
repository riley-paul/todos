import React from "react";
import Empty from "../ui/empty";
import { CompassIcon, HomeIcon } from "lucide-react";
import { Button } from "@radix-ui/themes";
import { Link } from "@tanstack/react-router";

const NotFoundScreen: React.FC = () => {
  return (
    <Empty.Root>
      <Empty.Header>
        <Empty.Media variant="icon">
          <CompassIcon />
        </Empty.Media>
        <Empty.Title>404 - Not found</Empty.Title>
        <Empty.Description>
          The page you are looking for does not exist. Please check the URL or
          return to the homepage.
        </Empty.Description>
      </Empty.Header>
      <Empty.Content>
        <Button asChild variant="surface">
          <Link to="/">
            <HomeIcon className="size-4" />
            Return home
          </Link>
        </Button>
      </Empty.Content>
    </Empty.Root>
  );
};

export default NotFoundScreen;
