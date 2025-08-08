import useMutations from "@/app/hooks/use-mutations";
import { qUser } from "@/lib/client/queries";
import {
  Card,
  Heading,
  SegmentedControl,
  Switch,
  Text,
} from "@radix-ui/themes";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import type React from "react";
import { useAtom } from "jotai";
import { themeAtom } from "../hooks/use-theme";

export const Route = createFileRoute("/_withBack/settings")({
  component: RouteComponent,
  loader: async ({ context }) => {
    const user = await context.queryClient.ensureQueryData(qUser);
    return { user };
  },
  beforeLoad: () => {
    return { title: "Settings" };
  },
});

type SettingProps = React.PropsWithChildren<{
  label: string;
}>;
const Setting: React.FC<SettingProps> = ({ label, children }) => (
  <Text size="2" className="flex items-center justify-between gap-2" as="label">
    {label}
    {children}
  </Text>
);

function RouteComponent() {
  const { data: user } = useSuspenseQuery(qUser);
  const { updateUserSettings } = useMutations();

  const [theme, setTheme] = useAtom(themeAtom);

  return (
    <article className="grid gap-4">
      <Heading as="h1" size="4">
        Settings
      </Heading>

      <Card className="grid gap-5 p-4">
        <Setting label="Group completed todos">
          <Switch
            checked={user.settingGroupCompleted}
            onCheckedChange={(settingGroupCompleted) => {
              updateUserSettings.mutate({ settingGroupCompleted });
            }}
          />
        </Setting>
        <Setting label="Hide unpinned lists">
          <Switch
            checked={user.settingHideUnpinned}
            onCheckedChange={(settingHideUnpinned) => {
              updateUserSettings.mutate({ settingHideUnpinned });
            }}
          />
        </Setting>
        <Setting label="Dark mode">
          <SegmentedControl.Root
            size="1"
            value={theme}
            onValueChange={(value) => setTheme(value as any)}
          >
            <SegmentedControl.Item value="system">System</SegmentedControl.Item>
            <SegmentedControl.Item value="dark">Dark</SegmentedControl.Item>
            <SegmentedControl.Item value="light">Light</SegmentedControl.Item>
          </SegmentedControl.Root>
        </Setting>
      </Card>
    </article>
  );
}
