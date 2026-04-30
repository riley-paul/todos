import { eq, useLiveSuspenseQuery } from "@tanstack/react-db";
import * as collections from "@/app/lib/collections";
import type { ListSelectDetails } from "@/lib/types2";
import { useUser } from "@/app/providers/user-provider";

export default function useGetLists(): ListSelectDetails[] {
  const user = useUser();
  const { data: lists } = useLiveSuspenseQuery((q) =>
    q
      .from({ list: collections.lists })
      .innerJoin({ listUser: collections.listUsers }, ({ list, listUser }) =>
        eq(list.id, listUser.listId),
      )
      .where(({ listUser }) => eq(listUser.userId, user.id))
      .select(({ list, listUser }) => ({
        id: list.id,
        name: list.name,
        show: listUser.show,
        order: listUser.order,
        isPending: listUser.isPending,
        todoCount: 0,
        otherUsers: [],
        createdAt: list.createdAt,
        updatedAt: list.updatedAt,
      })),
  );

  return lists;
}
