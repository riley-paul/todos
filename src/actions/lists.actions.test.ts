import { describe, it } from "vitest";

describe("lists.actions", () => {
  describe("populate", () => {
    it("should return the lists the user belongs to", async () => {});
    it("should not return lists the user does not belong to", async () => {});
  });
  describe("create", () => {
    it("should create a new list with the specified name", async () => {});
    it("should add the user to the new list", async () => {});
  });
  describe("update", () => {
    it("should update the specified fields of the list", async () => {});
    it("should not allow updating a list the user doesn't belong to", async () => {});
    it("should not allow updating a pending list", async () => {});
  });
  describe("remove", () => {
    it("should remove the specified list", async () => {});
    it("should not allow removing a list the user doesn't belong to", async () => {});
    it("should not allow removing a pending list", async () => {});
  });
  describe("updateSortShow", () => {
    it("should update the sort and show settings of the list", async () => {});
    it("should not allow updating the settings of a list the user doesn't belong to", async () => {});
    it("should not allow updating the settings of a pending list", async () => {});
  })
});
