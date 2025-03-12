import { z } from "zod";

const userInputs = {
  getMe: z.any(),
  remove: z.any(),
  checkIfEmailExists: z.object({ email: z.string() }),
};
export default userInputs;
