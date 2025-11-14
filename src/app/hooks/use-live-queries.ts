import {
  and,
  count,
  eq,
  useLiveQuery,
  useLiveSuspenseQuery,
} from "@tanstack/react-db";
import {
  listCollection,
  listUserCollection,
  todoCollection,
} from "@/app/lib/collections";
import { useSuspenseQuery } from "@tanstack/react-query";
import { qUser } from "@/app/lib/queries";

export function useLiveLists() {
  const { data: user } = useSuspenseQuery(qUser);
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
      .where(({ listUser }) => eq(listUser.userId, user.id))
      .select(({ list, listUser, todoCount }) => ({
        id: list.id,
        name: list.name,
        todoCount: todoCount.count,
        isPending: listUser.isPending,
        show: listUser.show,
      }))
      .orderBy(({ listUser }) => listUser.show, "desc")
      .orderBy(({ list }) => list.createdAt, "asc");
  });
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
