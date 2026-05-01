import {
  Button,
  Card,
  Heading,
  SegmentedControl,
  Switch,
  Text,
} from "@radix-ui/themes";
import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import { useAtom } from "jotai";
import { themeAtom } from "../hooks/use-theme";
import { alertSystemAtom } from "../components/alert-system/alert-system.store";
import { Trash2Icon } from "lucide-react";
import useGetSettings from "../hooks/actions/use-get-settings";
import * as collections from "@/app/lib/collections";
import { useUser } from "../providers/user-provider";
import { actions } from "astro:actions";
import { mutationCache, queryClient } from "../lib/query-client";

const deleteAccountMutation = mutationCache.build(queryClient, {
  mutationFn: actions.users.remove.orThrow,
  onSuccess: () => {
    window.location.reload();
  },
});

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
  const user = useUser();
  const settings = useGetSettings();

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
        handleDelete: () => deleteAccountMutation.execute({}),
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
              checked={settings.settingGroupCompleted}
              onCheckedChange={(value) => {
                collections.users.update(user.id, (draft) => {
                  draft.settingGroupCompleted = value;
                });
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
