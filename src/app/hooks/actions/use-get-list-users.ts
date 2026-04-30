import type { UserSelect } from "@/lib/types2";
import { eq, not, useLiveSuspenseQuery } from "@tanstack/react-db";
import * as collections from "@/app/lib/collections";
import { useUser } from "@/app/providers/user-provider";

export default function useGetListUsers(listId: string): UserSelect[] {
  const currentUser = useUser();

  const { data: users } = useLiveSuspenseQuery(
    (q) =>
      q
        .from({ user: collections.users })
        .join({ listUser: collections.listUsers }, ({ listUser, user }) =>
          eq(listUser.userId, user.id),
        )
        .select(({ listUser, user }) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          avatarUrl: user.avatarUrl,
          isPending: listUser.isPending,
        }))
        .where(({ listUser }) => eq(listUser.listId, listId))
        .where(({ user }) => not(eq(user.id, currentUser.id)))
        .distinct(),
    [listId],
  );

  return users;
}
