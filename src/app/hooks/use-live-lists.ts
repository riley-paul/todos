import { count, eq, useLiveSuspenseQuery } from "@tanstack/react-db";
import {
  listCollection,
  listUserCollection,
  todoCollection,
  userCollection,
} from "@/app/lib/collections";
import { useRouteContext } from "@tanstack/react-router";

export function useLiveLists() {
  const { currentUser } = useRouteContext({ strict: false });
  return useLiveSuspenseQuery((q) => {
    const todoCounts = q
      .from({ todo: todoCollection })
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
      .where(({ listUser }) => eq(listUser.userId, currentUser?.id))
      .select(({ list, listUser, todoCount }) => ({
        id: list.id,
        name: list.name,
        todoCount: todoCount.count,
        isPending: listUser.isPending,
        show: listUser.show,
        order: listUser.order,
      }))
      .orderBy(({ listUser }) => listUser.show, "desc")
      .orderBy(({ list }) => list.createdAt, "asc");
  });
}

export function useLiveListUsers(listId: string) {
  return useLiveSuspenseQuery(
    (q) =>
      q
        .from({ listUser: listUserCollection })
        .innerJoin({ user: userCollection }, ({ user, listUser }) =>
          eq(listUser.userId, user.id),
        )
        .where(({ listUser }) => eq(listUser.listId, listId))
        .select(({ user }) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          avatarUrl: user.avatarUrl,
        })),
    [listId],
  );
}

export function useLiveList(listId: string) {
  return useLiveSuspenseQuery(
    (q) => {
      const todoCounts = q
        .from({ todo: todoCollection })
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
        .where(({ list }) => eq(list.id, listId))
        .select(({ list, listUser, todoCount }) => ({
          id: list.id,
          name: list.name,
          todoCount: todoCount.count,
          isPending: listUser.isPending,
          show: listUser.show,
        }))
        .orderBy(({ listUser }) => listUser.show, "desc")
        .orderBy(({ list }) => list.createdAt, "asc")
        .findOne();
    },
    [listId],
  );
}
