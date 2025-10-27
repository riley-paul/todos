import { z } from "zod";

const userInputs = {
  getMe: z.any(),
  remove: z.any(),
  get: z.object({ search: z.string().optional() }),
  updateUserSettings: z
    .object({
      settingGroupCompleted: z.boolean(),
      settingListOrder: z.record(z.string(), z.number()),
    })
    .partial(),
};
export default userInputs;
