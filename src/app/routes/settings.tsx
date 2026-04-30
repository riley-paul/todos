import useMutations from "@/app/hooks/use-mutations";
import { qUser } from "@/app/lib/queries";
import {
  Button,
  Card,
  Heading,
  SegmentedControl,
  Switch,
  Text,
} from "@radix-ui/themes";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import { useAtom } from "jotai";
import { themeAtom } from "../hooks/use-theme";
import { alertSystemAtom } from "../components/alert-system/alert-system.store";
import { Trash2Icon } from "lucide-react";

export const Route = createFileRoute("/settings")({
  component: RouteComponent,
});

type SettingProps = React.PropsWithChildren<{
  label: string;
}>;
const Setting: React.FC<SettingProps> = ({ label, children }) => (
  <Text
    size="2"
    className="flex h-6 items-center justify-between gap-2"
    as="label"
  >
    {label}
    {children}
  </Text>
);

function RouteComponent() {
  const { data: user } = useSuspenseQuery(qUser);
  const { updateUserSettings, deleteUser } = useMutations();

  const [theme, setTheme] = useAtom(themeAtom);
  const [, dispatchAlert] = useAtom(alertSystemAtom);

  const handleDeleteAccount = () => {
    dispatchAlert({
      type: "open",
      data: {
        type: "delete",
        title: "Delete Account",
        message:
          "This action cannot be undone. This will permanently delete your account and remove your data from our servers.",
        handleDelete: () => {
          deleteUser.mutate({});
          dispatchAlert({ type: "close" });
        },
      },
    });
  };

  return (
    <React.Fragment>
      <Heading size="7">Settings</Heading>
      <article className="grid gap-4">
        <Card size="3" className="grid gap-5">
          <Setting label="Group completed todos">
            <Switch
              checked={user.settingGroupCompleted}
              onCheckedChange={(settingGroupCompleted) => {
                updateUserSettings.mutate({ settingGroupCompleted });
              }}
            />
          </Setting>
          <Setting label="Dark mode">
            <SegmentedControl.Root
              size="1"
              value={theme}
              onValueChange={(value) => setTheme(value as any)}
            >
              <SegmentedControl.Item value="system">
                System
              </SegmentedControl.Item>
              <SegmentedControl.Item value="dark">Dark</SegmentedControl.Item>
              <SegmentedControl.Item value="light">Light</SegmentedControl.Item>
            </SegmentedControl.Root>
          </Setting>
          <Setting label="Delete account">
            <Button size="2" color="red" onClick={handleDeleteAccount}>
              <Trash2Icon className="size-4" />
              Delete
            </Button>
          </Setting>
        </Card>
      </article>
    </React.Fragment>
  );
}
