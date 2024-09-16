import React from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader2, Plus } from "lucide-react";
import useMutations from "../hooks/use-mutations";
import useSelectedTag from "../hooks/use-selected-tag";
import { useMediaQuery } from "usehooks-ts";
import { MOBILE_MEDIA_QUERY } from "@/lib/constants";

const isOnlyHashtag = (value: string) =>
  value.startsWith("#") && value.trim().split(" ").length === 1;

const isEmptyString = (value: string) => value.trim() === "";

export default function Adder(): ReturnType<React.FC> {
  const { tag } = useSelectedTag();
  const defaultValue = tag === "~" || tag === "" ? "" : `#${tag} `;

  const inputRef = React.useRef<HTMLInputElement>(null);
  const [value, setValue] = React.useState<string>(defaultValue);
  const { createTodo } = useMutations();

  React.useEffect(() => {
    if (tag && (isOnlyHashtag(value) || isEmptyString(value))) {
      setValue(defaultValue);
    }
  }, [tag]);

  const create = () => {
    if (value) {
      createTodo.mutate({ data: { text: value } });
      setValue(defaultValue);
      inputRef.current?.focus();
    }
  };

  const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (isEmptyString(value) || isOnlyHashtag(value)) return;
        create();
      }}
      className="flex items-center gap-2"
    >
      <Input
        autoFocus
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="text-md px-4"
        placeholder="Add a todo..."
        onFocus={(e) => {
          if (!isOnlyHashtag(value)) {
            e.target.select();
          }
        }}
      />
      <input type="submit" hidden />
      <Button
        type="submit"
        size={isMobile ? "icon" : "default"}
        className="shrink-0"
        disabled={isEmptyString(value) || isOnlyHashtag(value)}
      >
        {createTodo.isPending ? (
          <Loader2 size="1.2rem" className="animate-spin" />
        ) : (
          <Plus size="1.2rem" />
        )}
        {!isMobile && <span className="ml-2">Add</span>}
      </Button>
    </form>
  );
}
