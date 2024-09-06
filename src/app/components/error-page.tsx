import { Bug } from "lucide-react";
import React from "react";
import { Button, buttonVariants } from "./ui/button";
import { isRouteErrorResponse, Link, useRouteError } from "react-router-dom";

interface Props {
  showGoHome?: boolean;
  retry?: () => void;
}

const ErrorPage: React.FC<Props> = (props) => {
  const { showGoHome, retry } = props;
  const error = useRouteError();
  console.error(error);

  let status = 500;
  let message = "An unknown error occurred. Please try again later.";

  if (isRouteErrorResponse(error)) {
    status = error.status;
    message = error.statusText;
  }

  return (
    <div className="flex h-full flex-1 items-center justify-center">
      <div className="flex h-full max-h-[50%] w-full max-w-sm flex-col gap-4 p-4">
        <div className="flex flex-row items-center gap-4">
          <Bug size="3rem" className="flex-shrink-0 text-primary" />
          <div className="flex flex-col">
            <h2 className="mr-2 text-lg font-bold">
              <span className="">{status} Error</span>
            </h2>
            <p className="text-sm text-muted-foreground">{message}</p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {retry && <Button onClick={() => retry()}>Retry</Button>}
          {showGoHome && (
            <Link className={buttonVariants({ variant: "secondary" })} to="/">
              Go Home
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
