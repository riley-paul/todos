import { z } from "zod";

const userInputs = {
  getMe: z.any(),
  remove: z.any(),
  get: z.object({ search: z.string().optional() }),
  updateUserSettings: z.object({
    settingGroupCompleted: z.boolean().optional(),
  }),
};
export default userInputs;
