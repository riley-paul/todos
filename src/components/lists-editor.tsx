import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import SingleInputForm from "./single-input-form";
import { Label } from "./ui/label";
import DeleteButton from "./ui/delete-button";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import useMutations from "@/hooks/use-mutations";
import type { ListSelect } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { listsQueryOptions } from "@/lib/queries";

type Props = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

const List: React.FC<{
  list: ListSelect;
}> = ({ list }) => {
  const { deleteList, updateList } = useMutations();

  const ref = React.useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = React.useState(false);

  useOnClickOutside(ref, () => setIsEditing(false));
  useEventListener("keydown", (e) => {
    if (e.key === "Escape") setIsEditing(false);
  });

  return (
    <div ref={ref} className="flex h-10 items-center gap-2 py-1">
      {isEditing ? (
        <SingleInputForm
          className="h-8"
          initialValue={list.name}
          handleSubmit={(name) => {
            updateList.mutate({ id: list.id, data: { name } });
            setIsEditing(false);
          }}
        />
      ) : (
        <span
          className="flex-1 cursor-pointer select-none"
          onClick={() => setIsEditing(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter") setIsEditing(true);
          }}
          tabIndex={0}
        >
          {list.name}
        </span>
      )}
      <span className="flex gap-1 text-sm text-secondary-foreground/80">
        <span className="font-semibold">{list.todoCount}</span>
        <span className="font-normal">tasks</span>
      </span>
      <DeleteButton handleDelete={() => deleteList.mutate({ id: list.id })} />
    </div>
  );
};

const ListsEditor: React.FC<Props> = (props) => {
  const { isOpen, setIsOpen } = props;
  const lists = useQuery(listsQueryOptions)?.data ?? [];
  const { createList } = useMutations();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage your lists</DialogTitle>
          <DialogDescription>
            Add, remove, edit and share your lists
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[300px] min-h-[150px] overflow-scroll rounded-lg bg-secondary/20 px-3">
          <div className="grid divide-y divide-secondary">
            {lists?.map((list) => <List key={list.id} list={list} />)}
          </div>
          {lists?.length === 0 && (
            <div className="flex h-full items-center justify-center py-2 text-sm text-muted-foreground">
              No lists yet
            </div>
          )}
        </div>
        <div className="grid gap-2">
          <Label>Add a List</Label>
          <SingleInputForm
            clearAfterSubmit
            initialValue=""
            inputProps={{ placeholder: "Enter list name" }}
            handleSubmit={(name) => createList.mutate({ name })}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ListsEditor;
