import { useSearchParams } from "react-router-dom";

export default function useSelectedTag() {
  const [searchParams] = useSearchParams();
  const tag = searchParams.get("tag") ?? "";
  return { tag };
}
