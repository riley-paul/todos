import React from "react";
import { Button } from "./ui/button";
import { isActionError } from "astro:actions";
import { cn } from "@/lib/utils";

interface Props {
  retry?: () => void;
  notFullHeight?: boolean;
  error?: unknown;
}

const ErrorPage: React.FC<Props> = (props) => {
  const { retry, notFullHeight, error } = props;

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
        "flex h-full min-h-[80vh] flex-1 items-center justify-center",
        notFullHeight && "min-h-32",
      )}
    >
      <div className="flex h-full w-full max-w-sm flex-col gap-4 p-4">
        <div className="flex flex-row items-center gap-4">
          <i className="fa-solid fa-viruses flex-shrink-0 text-[3rem] text-primary" />
          <div className="flex flex-col">
            <h2 className="mr-2 text-lg font-bold">
              <span className="">{status} Error</span>
            </h2>
            <p className="text-sm text-muted-foreground">{message}</p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {retry && <Button onClick={() => retry()}>Retry</Button>}
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
