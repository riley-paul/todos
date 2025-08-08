import { useLinkProps, type UseLinkPropsOptions } from "@tanstack/react-router";

export default function useIsLinkActive(options: UseLinkPropsOptions) {
  const linkProps = useLinkProps(options) as any;
  return linkProps["data-status"] === "active";
}
