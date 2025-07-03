import { goToList } from "@/lib/client/links";
import { Button } from "@radix-ui/themes";
import {
  createFileRoute,
  Link,
  Outlet,
  useParams,
} from "@tanstack/react-router";
import { MoveLeftIcon } from "lucide-react";

export const Route = createFileRoute("/_withBack")({
  component: RouteComponent,
});

function RouteComponent() {
  const { listId } = useParams({ strict: false });
  return (
    <main className="grid gap-4 px-3">
      <div>
        <Button asChild size="2" variant="ghost" className="gap-2">
          <Link {...goToList(listId)}>
            <MoveLeftIcon className="size-4" />
            Back
          </Link>
        </Button>
      </div>
      <Outlet />
    </main>
  );
}
