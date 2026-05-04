import { createDb } from "@/db";
import env from "@/envs-runtime";
import { provisionFixtures, type Fixtures } from "@/test/fixtures";
import { beforeEach, describe, it } from "vitest";
import { deleteAllData } from "@/db/scripts/delete-all-data";

const db = createDb(env);

describe("lists.actions", () => {
  let fixtures: Fixtures;

  beforeEach(async () => {
    await deleteAllData();
    fixtures = await provisionFixtures(db);
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
  });
});
