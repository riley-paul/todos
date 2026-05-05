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
import { actions } from "astro:actions";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { qUser } from "../lib/queries";
import useMutations from "../hooks/use-mutations";

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

const DeleteAccountSetting: React.FC = () => {
  const [, dispatchAlert] = useAtom(alertSystemAtom);

  const deleteAccountMutation = useMutation({
    mutationFn: actions.users.remove.orThrow,
    onSuccess: () => {
      dispatchAlert({ type: "close" });
      window.location.reload();
    },
  });

  const handleDeleteAccount = () => {
    dispatchAlert({
      type: "open",
      data: {
        type: "delete",
        title: "Delete Account",
        message:
          "This action cannot be undone. This will permanently delete your account and remove your data from our servers.",
        handleDelete: () => deleteAccountMutation.mutate({}),
      },
    });
  };

  return (
    <Setting label="Delete account">
      <Button
        size="1"
        color="red"
        variant="surface"
        onClick={handleDeleteAccount}
      >
        <Trash2Icon className="size-4" />
        Delete
      </Button>
    </Setting>
  );
};

const ThemeSetting: React.FC = () => {
  const [theme, setTheme] = useAtom(themeAtom);
  return (
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
  );
};

const GroupCompletedSetting: React.FC = () => {
  const { data: settings } = useSuspenseQuery(qUser());
  const { updateUserSettings } = useMutations();

  return (
    <Setting label="Group completed todos">
      <Switch
        checked={settings.settingGroupCompleted}
        onCheckedChange={(value) => {
          updateUserSettings.mutate({
            settingGroupCompleted: value,
          });
        }}
      />
    </Setting>
  );
};

function RouteComponent() {
  return (
    <React.Fragment>
      <Heading size="7">Settings</Heading>
      <article className="grid gap-4">
        <Card className="grid gap-5">
          <GroupCompletedSetting />
          <ThemeSetting />
        </Card>
        <Card>
          <Setting label="Enable notifications">
            <Button size="1">Enable</Button>
          </Setting>
        </Card>
        <Card>
          <DeleteAccountSetting />
        </Card>
      </article>
    </React.Fragment>
  );
}
