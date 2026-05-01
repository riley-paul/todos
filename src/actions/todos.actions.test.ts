import { describe, it } from "vitest";

describe("todos.actions", () => {
  describe("populate", () => {
    it("should return the todos in the user's lists", async () => {});
    it("should return the todos with their authors and lists", async () => {});
    it("should exclude todos from lists the user doesn't belong to", async () => {});
    it("should exlude todos from pending lists", () => {});
  });
  describe("create", () => {
    it("should create a new todo in the specified list", async () => {});
    it("should not allow creating a todo in a list the user doesn't belong to", async () => {});
    it("should not allow creating a todo in a pending list", async () => {});
  });
  describe("update", () => {
    it("should update the specified fields of the todo", async () => {});
    it("should not allow updating a todo in a list the user doesn't belong to", async () => {});
    it("should not allow updating a todo in a pending list", async () => {});
    it("should not allow moving a todo to a list the user doesn't belong to", async () => {});
  });
  describe("remove", () => {
    it("should remove the specified todo", async () => {});
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
