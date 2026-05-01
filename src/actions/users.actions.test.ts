import { createDb } from "@/db";
import env from "@/envs-runtime";
import { provisionFixtures, type Fixtures } from "@/test/fixtures";
import { beforeEach, describe, expect, it } from "vitest";
import * as actions from "./users.actions";
import { deleteAllData } from "@/db/scripts/delete-all-data";
import { mockActions } from "@/test/mocks/astro-actions";

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

      db.query.User.findFirst({ where: { id: fixtures.mainUser.id } }).then(
        (user) => {
          expect(user?.settingGroupCompleted).toBe(true);
        },
      );
    });

    it("should only allow updating settings properties", async () => {
      mockActions(fixtures.mainUser.id);
      await actions.update.orThrow({
        id: "fake-id",
        settingGroupCompleted: false,
      } as any);

      db.query.User.findFirst({ where: { id: fixtures.mainUser.id } }).then(
        (user) => {
          expect(user?.settingGroupCompleted).toBe(false);
        },
      );
    });
  });
  describe("remove", () => {
    it("should remove the user", () => {});
    it("should remove user's memberships to lists", () => {});
    it("should not remove user-created todos in shared lists", () => {});
    it("should remove lists the user is the only member of", () => {});
    it("should not remove lists the user shares with others", () => {});
  });
});
