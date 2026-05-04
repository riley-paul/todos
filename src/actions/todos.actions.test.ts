import { createDb } from "@/db";
import env from "@/envs-runtime";
import { provisionFixtures, type Fixtures } from "@/test/fixtures";
import { beforeEach, describe, expect, it } from "vitest";
import * as actions from "./todos.actions";
import { deleteAllData } from "@/db/scripts/delete-all-data";
import { mockActions } from "@/test/mocks/astro-actions";

const db = createDb(env);

describe("todos.actions", () => {
  let fixtures: Fixtures;

  beforeEach(async () => {
    await deleteAllData();
    fixtures = await provisionFixtures(db);
  });

  describe("create", () => {
    it("should create a new todo in the specified list", async () => {
      mockActions(fixtures.mainUser.id);
      const listId = fixtures.mainUserSharedList.id;
      const newTodoData = {
        id: "new-todo-id",
        text: "New Todo",
        isCompleted: false,
        listId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const newTodo = await actions.create.orThrow(newTodoData);

      expect(newTodo).toMatchObject({
        ...newTodoData,
        userId: fixtures.mainUser.id,
      });

      const dbTodo = await db.query.Todo.findFirst({
        where: { id: newTodo.id },
      });
      expect(dbTodo).toBeDefined();
      expect(dbTodo).toMatchObject({
        ...newTodoData,
        userId: fixtures.mainUser.id,
      });
    });
    it("should not allow creating a todo in a list the user doesn't belong to", async () => {
      mockActions(fixtures.mainUser.id);
      const newTodoData = {
        id: "new-todo-id",
        text: "New Todo",
        isCompleted: false,
        listId: fixtures.outsideUserList.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await expect(actions.create.orThrow(newTodoData)).rejects.toMatchObject({
        code: "FORBIDDEN",
      });
    });
    it("should not allow creating a todo in a pending list", async () => {});
  });
  describe("update", () => {
    it("should update the specified fields of the todo", async () => {});
    it("should not allow updating a todo in a list the user doesn't belong to", async () => {});
    it("should not allow updating a todo in a pending list", async () => {});
    it("should not allow moving a todo to a list the user doesn't belong to", async () => {});
  });
  describe("remove", () => {
    it("should remove the specified todo", async () => {
      mockActions(fixtures.mainUser.id);
      const todoToRemove = fixtures.unsharedListTodos[0];
      await actions.remove.orThrow({ todoId: todoToRemove.id });

      const deletedTodo = await db.query.Todo.findFirst({
        where: { id: todoToRemove.id },
      });
      expect(deletedTodo).toBeUndefined();
    });
    it("should not allow removing a todo in a list the user doesn't belong to", async () => {});
    it("should not allow removing a todo in a pending list", async () => {});
  });
  describe("deleteCompleted", () => {
    it("should delete all completed todos in the specified list", async () => {});
    it("should not allow deleting todos in a list the user doesn't belong to", async () => {});
    it("should not allow deleting todos in a pending list", async () => {});
  });
  describe("uncheckCompleted", () => {
    it("should uncheck all completed todos in the specified list", async () => {});
    it("should not allow unchecking todos in a list the user doesn't belong to", async () => {});
    it("should not allow unchecking todos in a pending list", async () => {});
  });
});
