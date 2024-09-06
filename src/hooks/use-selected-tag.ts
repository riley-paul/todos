import { useSearchParams } from "react-router-dom";

export default function useSelectedTag() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tag = searchParams.get("tag") ?? "";
  const toggleTag = (tag: string) => {
    const isCurrentTag = tag === searchParams.get("tag");
    setSearchParams((prev) => ({
      ...prev,
      tag: isCurrentTag ? "" : tag,
    }));
  };
  return { tag, toggleTag };
}
