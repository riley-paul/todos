import { createDb } from "@/db";
import { deleteAllData } from "@/db/scripts/delete-all-data";
import env from "@/envs-runtime";
import { provisionFixtures, type Fixtures } from "@/test/fixtures";
import { mockActions } from "@/test/mocks/astro-actions";
import { beforeEach, describe, expect, it } from "vitest";
import * as actions from "./users.actions";

const db = createDb(env);

describe("users.actions", () => {
  let fixtures: Fixtures;

  beforeEach(async () => {
    await deleteAllData();
    fixtures = await provisionFixtures(db);
  });

  describe("populate", () => {
    it("should return the current user and other users in the same lists", async () => {
      mockActions(fixtures.mainUser.id);
      const users = await actions.populate.orThrow();

      expect(Array.isArray(users)).toBe(true);

      const userIds = users.map((u) => u.id);
      expect(userIds).toContain(fixtures.mainUser.id);
      expect(userIds).toContain(fixtures.collaboratingUser.id);
      expect(userIds).not.toContain(fixtures.outsideUser.id);
    });
  });

  describe("update", () => {
    it("should update the user's settings", async () => {
      mockActions(fixtures.mainUser.id);
      await actions.update.orThrow({ settingGroupCompleted: true });

      const user = await db.query.User.findFirst({
        where: { id: fixtures.mainUser.id },
      });
      expect(user?.settingGroupCompleted).toBe(true);
    });

    it("should only allow updating settings properties", async () => {
      mockActions(fixtures.mainUser.id);
      await actions.update.orThrow({
        id: "fake-id",
        settingGroupCompleted: false,
      } as any);

      const user = await db.query.User.findFirst({
        where: { id: fixtures.mainUser.id },
      });
      // id should be unchanged — zUserSettings strips non-settings fields
      expect(user?.id).toBe(fixtures.mainUser.id);
    });
  });

  describe("remove", () => {
    it("should remove the user", async () => {
      mockActions(fixtures.mainUser.id);
      await actions.remove.orThrow();

      const user = await db.query.User.findFirst({
        where: { id: fixtures.mainUser.id },
      });
      expect(user).toBeUndefined();
    });

    it("should remove user's memberships to lists", async () => {
      mockActions(fixtures.mainUser.id);
      await actions.remove.orThrow();

      const memberships = await db.query.ListUser.findMany({
        where: { userId: fixtures.mainUser.id },
      });
      expect(memberships).toHaveLength(0);
    });

    it("should remove lists the user is the only member of", async () => {
      mockActions(fixtures.mainUser.id);
      await actions.remove.orThrow();

      const list = await db.query.List.findFirst({
        where: { id: fixtures.mainUserUnsharedList.id },
      });
      expect(list).toBeUndefined();
    });

    it("should not remove lists the user shares with others", async () => {
      mockActions(fixtures.mainUser.id);
      await actions.remove.orThrow();

      const list = await db.query.List.findFirst({
        where: { id: fixtures.mainUserSharedList.id },
      });
      expect(list).toBeDefined();
    });
  });
});
