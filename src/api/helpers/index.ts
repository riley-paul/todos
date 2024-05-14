import type { CookieOptions } from "hono/utils/cookie";
import type { CookieAttributes } from "lucia";

export const sameSiteConversion = (
  sameSite: "strict" | "none" | "lax" | undefined,
): "Strict" | "Lax" | "None" | undefined => {
  switch (sameSite) {
    case "strict":
      return "Strict";
    case "lax":
      return "Lax";
    case "none":
      return "None";
    default:
      return undefined;
  }
};

export const luciaToHonoCookieAttributes = (
  attributes: CookieAttributes,
): CookieOptions => ({
  ...attributes,
  sameSite: sameSiteConversion(attributes.sameSite),
});
