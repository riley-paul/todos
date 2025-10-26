import { Link, type ErrorRouteComponent } from "@tanstack/react-router";
import Empty from "../ui/empty";
import { Button } from "@radix-ui/themes";
import { BugIcon, HomeIcon, RotateCwIcon } from "lucide-react";

const ErrorScreen: ErrorRouteComponent = ({ error }) => {
  return (
    <Empty.Root>
      <Empty.Header>
        <Empty.Media variant="icon">
          <BugIcon />
        </Empty.Media>
        <Empty.Title>500 - {error.name}</Empty.Title>
        <Empty.Description>{error.message}</Empty.Description>
      </Empty.Header>
      <Empty.Content>
        <div className="flex items-center gap-2">
          <Button asChild variant="surface">
            <Link to="/">
              <HomeIcon className="size-4" />
              Return home
            </Link>
          </Button>
          <Button onClick={() => window.location.reload()}>
            <RotateCwIcon className="size-4" />
            Refresh
          </Button>
        </div>
      </Empty.Content>
    </Empty.Root>
  );
};

export default ErrorScreen;
