import { zSettings } from "@/lib/types";
import { z } from "astro/zod";

export const getMe = z.any();

export const remove = z.any();

export const get = z.object({ search: z.string().optional() });

export const updateUserSettings = zSettings.partial();
