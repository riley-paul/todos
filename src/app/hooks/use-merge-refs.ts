import { useCallback, type Ref } from "react";

export default function useMergeRefs<T>(
  ...refs: (Ref<T> | undefined)[]
): (node: T | null) => void | (() => void) {
  return useCallback(
    (currentValue: T | null) => {
      // Array to store cleanup functions returned by functional refs
      const cleanups: (() => void)[] = [];

      for (const ref of refs) {
        if (!ref) continue;

        if (typeof ref === "function") {
          // React 19 callback refs can return a cleanup function
          const cleanup = ref(currentValue);
          if (typeof cleanup === "function") {
            cleanups.push(cleanup);
          }
        } else if (typeof ref === "object" && "current" in ref) {
          // Handle standard mutable ref objects
          (ref as any).current = currentValue;
        }
      }

      // React 19 cleanup: return a function that fires when the ref detaches
      return () => {
        for (const cleanup of cleanups) {
          cleanup();
        }
      };
    },
    [refs],
  ); // Note: Ensure refs array dependency is stable or deeply compared if needed
}
