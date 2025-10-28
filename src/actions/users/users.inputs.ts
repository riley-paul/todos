import { zSettings } from "@/lib/types";
import { z } from "astro/zod";

export const getMe = z.any();

export const remove = z.any();

export const updateUserSettings = zSettings.partial();
