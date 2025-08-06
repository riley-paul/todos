import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { useMediaQuery } from "usehooks-ts";

const COLOR_SCHEME_QUERY = "(prefers-color-scheme: dark)";
const LOCAL_STORAGE_KEY = "theme-preference";

type Theme = "light" | "dark" | "system";

export const themeAtom = atomWithStorage<Theme>(LOCAL_STORAGE_KEY, "system");

export const useAppearance = (): "light" | "dark" => {
  const [theme] = useAtom(themeAtom);
  const prefersDark = useMediaQuery(COLOR_SCHEME_QUERY);

  if (theme === "system") return prefersDark ? "dark" : "light";
  return theme;
};
