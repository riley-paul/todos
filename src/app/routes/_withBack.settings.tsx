import { Card, Heading, Switch, Text } from "@radix-ui/themes";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_withBack/settings")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <article className="grid gap-4">
      <Heading as="h1" size="4">
        Settings
      </Heading>

      <Card>
        <Text size="2" className="flex items-center justify-between" as="label">
          Group completed todos
          <Switch />
        </Text>
      </Card>
    </article>
  );
}
