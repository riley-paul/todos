import React from "react";
import { useThemeStore } from "./theme-store.ts";
import { useCookies } from "react-cookie";

const MEDIA_QUERY_STR = "(prefers-color-scheme: dark)";

const setAppTheme = (theme: "light" | "dark") => {
  const root = window.document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(theme);
};

const setSystemTheme = (mq: MediaQueryList) => {
  const systemTheme = mq.matches ? "dark" : "light";
  setAppTheme(systemTheme);
};

export function ThemeListener() {
  const { theme } = useThemeStore();
  const [_, setCookie, removeCookie] = useCookies(["theme"]);

  React.useEffect(() => {
    const mq = window.matchMedia(MEDIA_QUERY_STR);
    removeCookie("theme", { path: "/" });

    if (theme === "system") {
      setSystemTheme(mq);
      return;
    }

    setCookie("theme", theme, { path: "/" });
    setAppTheme(theme);
  }, [theme]);

  React.useEffect(() => {
    const mq = window.matchMedia(MEDIA_QUERY_STR);
    mq.addEventListener("change", () => {
      const { theme } = useThemeStore.getState();
      if (theme === "system") setSystemTheme(mq);
    });
  }, [theme]);

  return null;
}
