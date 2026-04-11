import { zSettings } from "@/lib/types";
import { z } from "astro/zod";

export const getMe = z.object();

export const remove = z.object();

export const updateUserSettings = zSettings.partial();
