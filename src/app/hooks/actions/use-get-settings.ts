import { useUser } from "@/app/providers/user-provider";
import { eq, useLiveSuspenseQuery } from "@tanstack/react-db";
import * as collections from "@/app/lib/collections";
import type { UserSettings } from "@/lib/types";

const defaultSettings: Required<UserSettings> = {
  settingGroupCompleted: true,
};

export default function useGetSettings(): Required<UserSettings> {
  const currentUser = useUser();

  const { data: user } = useLiveSuspenseQuery((q) =>
    q
      .from({ user: collections.users })
      .where(({ user }) => eq(user.id, currentUser.id))
      .findOne(),
  );

  return { ...defaultSettings, ...user };
}
