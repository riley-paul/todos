import { Button } from "@radix-ui/themes";
import { createFileRoute, Outlet, useRouter } from "@tanstack/react-router";
import { MoveLeftIcon } from "lucide-react";

export const Route = createFileRoute("/_withBack")({
  component: RouteComponent,
});

function RouteComponent() {
  const router = useRouter();
  return (
    <main className="grid gap-4 px-3">
      <div>
        <Button
          onClick={() => router.history.back()}
          disabled={!router.history.canGoBack()}
          size="2"
          variant="ghost"
          className="gap-2"
        >
          <MoveLeftIcon className="size-4" />
          Back
        </Button>
      </div>
      <Outlet />
    </main>
  );
}
