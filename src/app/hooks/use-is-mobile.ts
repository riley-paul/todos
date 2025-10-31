import { useMediaQuery } from "usehooks-ts";

const MOBILE_BREAKPOINT = 520;

export function useIsMobile(breakpoint: number = MOBILE_BREAKPOINT) {
  const isMobile = useMediaQuery(`(max-width: ${breakpoint}px)`);

  return !!isMobile;
}
