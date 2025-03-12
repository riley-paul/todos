import { z } from "zod";

export const getMe = z.any();
export const remove = z.any();
export const checkIfEmailExists = z.object({ email: z.string() });
