import React from "react";
import { Badge } from "./ui/badge";
import { useAtom } from "jotai/react";
import { selectedListAtom } from "@/lib/store";
import { Separator } from "./ui/separator";
import { Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { listsQueryOptions, todosQueryOptions } from "@/lib/queries";

const List: React.FC<{
  value: string | undefined;
  name: string;
  count?: number;
}> = ({ value, name, count = 0 }) => {
  const [selectedList, setSelectedList] = useAtom(selectedListAtom);
  const isSelected = selectedList === value;
  return (
    <Badge
      className="h-6 cursor-pointer select-none"
      variant={isSelected ? "default" : "secondary"}
      onClick={() => setSelectedList(value)}
    >
      <span>{name}</span>
      {count > 0 && (
        <span
          className={cn(
            "ml-1.5 text-muted-foreground",
            isSelected && "text-secondary",
          )}
        >
          {count}
        </span>
      )}
    </Badge>
  );
};

const Lists: React.FC = () => {
  const listsQuery = useQuery(listsQueryOptions);
  const allCount = useQuery(todosQueryOptions({ type: "all" }))?.data?.length;
  const inboxCount = useQuery(todosQueryOptions({ type: "inbox" }))?.data
    ?.length;

  const [editorIsOpen, setEditorIsOpen] = React.useState(false);

  return (
    <div className="flex flex-wrap gap-2 px-3">
      <List value={undefined} name="Inbox" count={inboxCount} />
      <List value={"all"} name="All" count={allCount} />
      <div className="flex items-center">
        <Separator orientation="vertical" className="h-5" />
      </div>
      {listsQuery.data?.map((list) => (
        <List
          key={list.id}
          value={list.id}
          name={list.name}
          count={list.count}
        />
      ))}
      <Badge
        className="h-6 cursor-pointer select-none px-1.5 font-normal"
        onClick={() => setEditorIsOpen(true)}
      >
        <Pencil className="size-3" />
        {/* <span>Edit lists</span> */}
      </Badge>
      {/* <ListsEditor isOpen={editorIsOpen} setIsOpen={setEditorIsOpen} /> */}
    </div>
  );
};

export default Lists;
