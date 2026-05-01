import { createDb } from "@/db";
import env from "@/envs-runtime";
import { provisionFixtures, type Fixtures } from "@/test/fixtures";
import { beforeEach, describe, expect, it } from "vitest";
import * as actions from "./list-users.actions";
import { deleteAllData } from "@/db/scripts/delete-all-data";
import { mockActions } from "@/test/mocks/astro-actions";

const db = createDb(env);

describe("list-users.actions", () => {
  let fixtures: Fixtures;

  beforeEach(async () => {
    await deleteAllData();
    fixtures = await provisionFixtures(db);
  });

  describe("populate", () => {
    it("should return listusers associated with lists the user belongs to", async () => {
      mockActions(fixtures.mainUser.id);
      const listUsers = await actions.populate.orThrow();

      expect(Array.isArray(listUsers)).toBe(true);
      const listIds = listUsers.map((lu) => lu.listId);
      expect(listIds).toContain(fixtures.mainUserSharedList.id);
      expect(listIds).toContain(fixtures.mainUserUnsharedList.id);
      expect(listIds).not.toContain(fixtures.outsideUserList.id);

      const userIds = listUsers.map((lu) => lu.userId);
      expect(userIds).toContain(fixtures.mainUser.id);
      expect(userIds).toContain(fixtures.collaboratingUser.id);
      expect(userIds).not.toContain(fixtures.outsideUser.id);
    });
  });
  describe("acceptInvite", () => {
    it("should change the status of the listuser to accepted", () => {});
    it("should not allow accepting an invite for a list the user doesn't belong to", () => {});
    it("should not allow accepting an invite for a list that isn't pending", () => {});
  });
  describe("leaveList", () => {
    it("should remove the user from the list", () => {});
    it("should not allow leaving a list the user doesn't belong to", () => {});
  });
  describe("inviteToList", () => {
    it("should create a pending listuser for the invited user", () => {});
    it("should not allow inviting a user to a list the inviter doesn't belong to", () => {});
    it("should not allow a pending user to invite another user", () => {});
    it("should not allow inviting a user that doesn't exist", () => {});
    it("should not allow inviting a user that is already a member", () => {});
  });
  describe("removeFromList", () => {
    it("should remove the specified user from the list", () => {});
    it("should not allow removing a user from a list the remover doesn't belong to", () => {});
  });
});
