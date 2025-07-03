import { z } from "zod";

const userInputs = {
  getMe: z.any(),
  remove: z.any(),
  checkIfEmailExists: z.object({ email: z.string() }),
  updateUserSettings: z.object({
    settingGroupCompleted: z.boolean().optional(),
  }),
};
export default userInputs;
