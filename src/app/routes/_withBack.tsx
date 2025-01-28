import { Button } from "@radix-ui/themes";
import { createFileRoute, Link, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_withBack")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="grid gap-4">
      <div>
        <Button asChild size="2" variant="ghost" className="gap-2">
          <Link to="..">
            <i className="fas fa-arrow-left" />
            Back
          </Link>
        </Button>
      </div>
      <Outlet />
    </main>
  );
}
