import { Button, Text } from "@radix-ui/themes";
import {
  createFileRoute,
  Outlet,
  useLocation,
  useRouter,
} from "@tanstack/react-router";
import { MoveLeftIcon } from "lucide-react";
import AppLayout from "../components/app-layout";
import { slugToTitle } from "@/lib/client/utils";

export const Route = createFileRoute("/_withBack")({
  component: RouteComponent,
});

function RouteComponent() {
  const router = useRouter();
  const slug = useLocation().pathname.split("/").pop() || "Back";

  return (
    <AppLayout
      breadcrumb={
        <div className="container2 h-8">
          <Text size="2" weight="medium">
            {slugToTitle(slug)}
          </Text>
        </div>
      }
    >
      <main className="grid gap-4">
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
    </AppLayout>
  );
}
