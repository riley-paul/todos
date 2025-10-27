import { zSettings } from "@/lib/types";
import { z } from "astro/zod";

const userInputs = {
  getMe: z.any(),
  remove: z.any(),
  get: z.object({ search: z.string().optional() }),
  updateUserSettings: zSettings.partial(),
};
export default userInputs;
