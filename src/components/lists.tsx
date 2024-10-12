import React from "react";
import { Badge } from "./ui/badge";
import { useAtom } from "jotai/react";
import { selectedListAtom, type SelectedList } from "@/lib/store";
import { Separator } from "./ui/separator";
import { Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { listsQueryOptions, todosQueryOptions } from "@/lib/queries";
import { Button } from "./ui/button";
import ListsEditor from "./lists-editor";

const List: React.FC<{
  value: SelectedList;
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
  const inboxCount = useQuery(todosQueryOptions({ listId: null }))?.data
    ?.length;
  const allCount = useQuery(todosQueryOptions({ listId: undefined }))?.data
    ?.length;

  const [editorIsOpen, setEditorIsOpen] = React.useState(false);

  return (
    <div className="flex flex-wrap gap-2 px-3">
      <List value={null} name="Inbox" count={inboxCount} />
      <List value={undefined} name="All" count={allCount} />
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
      <Button
        variant="outline"
        className="h-6 cursor-pointer select-none px-1.5 font-normal"
        onClick={() => setEditorIsOpen(true)}
      >
        <Pencil className="size-3" />
      </Button>
      <ListsEditor isOpen={editorIsOpen} setIsOpen={setEditorIsOpen} />
    </div>
  );
};

export default Lists;
