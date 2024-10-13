import InvalidationController from "@/lib/invalidation-controller";

export const invalidateUsers = (userIds: string[]) => {
  InvalidationController.getInstance().invalidateKey(userIds);
};
