import useMutations from "@/hooks/use-mutations";
import type { ListSelect } from "@/lib/types";
import React from "react";
import { Button } from "./ui/button";
import DeleteButton from "./ui/delete-button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

type Props = {
  list?: ListSelect;
  onSubmit?: () => void;
};

const ListForm: React.FC<Props> = (props) => {
  const { list, onSubmit } = props;
  const { updateList, createList, deleteList } = useMutations();

  const [name, setName] = React.useState(list?.name ?? "");

  return (
    <form
      className={"grid items-start gap-4"}
      onSubmit={(e) => {
        e.preventDefault();
        if (list) {
          updateList.mutate({ id: list.id, data: { name } });
        } else {
          createList.mutate({ name });
        }
        onSubmit?.();
      }}
    >
      <div className="grid gap-2">
        <Label htmlFor="name">Name</Label>
        <Input
          type="name"
          id="name"
          autoFocus
          value={name}
          placeholder="List name"
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-2">
        <Button type="submit" className="flex-1">
          Save changes
        </Button>
        {list && (
          <DeleteButton
            handleDelete={() => deleteList.mutate({ id: list.id })}
          />
        )}
      </div>
    </form>
  );
};

export default ListForm;
