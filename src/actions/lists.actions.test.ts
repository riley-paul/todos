import { createDb } from "@/db";
import env from "@/envs-runtime";
import { provisionFixtures, type Fixtures } from "@/test/fixtures";
import { beforeEach, describe, expect, it } from "vitest";
import * as actions from "./lists.actions";
import { deleteAllData } from "@/db/scripts/delete-all-data";
import { mockActions } from "@/test/mocks/astro-actions";

const db = createDb(env);

describe("lists.actions", () => {
  let fixtures: Fixtures;

  beforeEach(async () => {
    await deleteAllData();
    fixtures = await provisionFixtures(db);
  });

  describe("populate", () => {
    it("should return the lists the user belongs to", async () => {
      mockActions(fixtures.mainUser.id);
      const lists = await actions.populate.orThrow();

      expect(Array.isArray(lists)).toBe(true);
      const listIds = lists.map((l) => l.id);
      expect(listIds).toContain(fixtures.mainUserSharedList.id);
      expect(listIds).toContain(fixtures.mainUserUnsharedList.id);
      expect(listIds).not.toContain(fixtures.outsideUserList.id);
    });
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
