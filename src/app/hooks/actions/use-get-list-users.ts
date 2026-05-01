import type { UserSelectListDetails } from "@/lib/types";
import { eq, not, useLiveSuspenseQuery } from "@tanstack/react-db";
import * as collections from "@/app/lib/collections";
import { useUser } from "@/app/providers/user-provider";

export default function useGetListUsers(
  listId: string,
): UserSelectListDetails[] {
  const currentUser = useUser();

  const { data: users } = useLiveSuspenseQuery(
    (q) =>
      q
        .from({ user: collections.users })
        .innerJoin({ listUser: collections.listUsers }, ({ listUser, user }) =>
          eq(listUser.userId, user.id),
        )
        .distinct()
        .where(({ listUser }) => eq(listUser.listId, listId))
        .where(({ user }) => not(eq(user.id, currentUser.id)))
        .orderBy(({ user }) => user.name, "asc")
        .select(({ listUser, user }) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          avatarUrl: user.avatarUrl,
          isPending: listUser.isPending,
        })),
    [listId],
  );

  return users;
}
