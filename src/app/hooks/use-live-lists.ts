import {
  and,
  count,
  createCollection,
  eq,
  liveQueryCollectionOptions,
  not,
  useLiveSuspenseQuery,
} from "@tanstack/react-db";
import {
  listCollection,
  listUserCollection,
  todoCollection,
  userCollection,
} from "@/app/lib/collections";
import { useRouteContext } from "@tanstack/react-router";

export const liveListCollection = (userId: string | undefined) =>
  createCollection(
    liveQueryCollectionOptions({
      query: (q) => {
        const todoCounts = q
          .from({ todo: todoCollection })
          .where(({ todo }) => eq(todo.isCompleted, false))
          .groupBy(({ todo }) => todo.listId)
          .select(({ todo }) => ({
            listId: todo.listId,
            count: count(todo.id),
          }));

        return q
          .from({ list: listCollection })
          .innerJoin({ listUser: listUserCollection }, ({ listUser, list }) =>
            eq(listUser.listId, list.id),
          )
          .innerJoin({ todoCount: todoCounts }, ({ todoCount, list }) =>
            eq(todoCount.listId, list.id),
          )
          .where(({ listUser }) => eq(listUser.userId, userId))
          .select(({ list, listUser, todoCount }) => ({
            id: list.id,
            name: list.name,
            todoCount: todoCount.count,
            isPending: listUser.isPending,
            show: listUser.show,
            order: listUser.order,
            listUserId: listUser.id,
          }))
          .orderBy(({ listUser }) => listUser.order, "asc")
          .orderBy(({ listUser }) => listUser.show, "desc");
      },
    }),
  );

export function useLiveLists() {
  const { currentUser } = useRouteContext({ strict: false });
  return useLiveSuspenseQuery((q) =>
    q.from({ list: liveListCollection(currentUser?.id) }),
  );
}

export function useLiveList(listId: string) {
  const { currentUser } = useRouteContext({ strict: false });
  return useLiveSuspenseQuery(
    (q) =>
      q
        .from({ list: liveListCollection(currentUser?.id) })
        .where(({ list }) => eq(list.id, listId))
        .findOne(),
    [listId],
  );
}

export function useLiveListUsers(listId: string) {
  const { currentUser } = useRouteContext({ strict: false });
  return useLiveSuspenseQuery(
    (q) =>
      q
        .from({ listUser: listUserCollection })
        .innerJoin({ user: userCollection }, ({ user, listUser }) =>
          eq(listUser.userId, user.id),
        )
        .where(({ listUser }) =>
          and(
            eq(listUser.listId, listId),
            eq(listUser.isPending, false),
            not(eq(listUser.userId, currentUser?.id)),
          ),
        )
        .select(({ user }) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          avatarUrl: user.avatarUrl,
        })),
    [listId],
  );
}
