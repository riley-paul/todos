import React from "react";
import { isActionError } from "astro:actions";
import { cn } from "@/lib/client/utils";
import { Button, Heading, Text } from "@radix-ui/themes";
import { Link } from "@tanstack/react-router";
import { BugIcon } from "lucide-react";

interface Props {
  retry?: () => void;
  notFullHeight?: boolean;
  error?: unknown;
  goHome?: boolean;
}

const ErrorPage: React.FC<Props> = (props) => {
  const { retry, notFullHeight, error, goHome } = props;

  console.error(error);

  let status = 500;
  let message = "An unknown error occurred. Please try again later.";

  if (isActionError(error)) {
    status = error.status;
    message = error.message;
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center",
        notFullHeight && "min-h-52",
      )}
    >
      <div className="flex h-full w-full max-w-xs flex-col gap-4 px-4 py-16">
        <div className="flex flex-row items-center gap-4">
          <BugIcon className="size-[2.5rem] text-red-10" />
          <div className="flex flex-col">
            <Heading as="h3" size="4">
              {status} Error
            </Heading>
            <Text size="2" color="gray">
              {message}
            </Text>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {retry && (
            <Button variant="soft" onClick={() => retry()}>
              Retry
            </Button>
          )}
          {goHome && (
            <Button variant="soft" asChild>
              <Link to="/">Go Home</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
