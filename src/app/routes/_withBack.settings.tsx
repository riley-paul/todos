import useMutations from "@/hooks/use-mutations";
import { qUser } from "@/lib/client/queries";
import { Card, Heading, Switch, Text } from "@radix-ui/themes";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_withBack/settings")({
  component: RouteComponent,
  loader: async ({ context }) => {
    const user = await context.queryClient.ensureQueryData(qUser);
    return { user };
  },
});

function RouteComponent() {
  const { data: user } = useSuspenseQuery(qUser);
  const { updateUserSettings } = useMutations();
  return (
    <article className="grid gap-4">
      <Heading as="h1" size="4">
        Settings
      </Heading>

      <Card>
        <Text
          size="2"
          weight="medium"
          className="flex items-center justify-between"
          as="label"
        >
          Group completed todos
          <Switch
            checked={user.settingGroupCompleted}
            onCheckedChange={(settingGroupCompleted) => {
              updateUserSettings.mutate({ settingGroupCompleted });
            }}
          />
        </Text>
      </Card>
    </article>
  );
}
