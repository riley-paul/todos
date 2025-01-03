import React from "react";
import { Button, Heading, Popover, TextField } from "@radix-ui/themes";
import useMutations from "@/hooks/use-mutations";

const ListAdderForm: React.FC<{ onSubmit: (value: string) => void }> = ({
  onSubmit,
}) => {
  const [value, setValue] = React.useState("");
  return (
    <form
      className="grid gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(value);
      }}
    >
      <TextField.Root
        placeholder="Unnamed List"
        minLength={1}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <input type="submit" hidden />
      <Button size="2" variant="surface" type="submit">
        <i className="fa-solid fa-save" />
        Save
      </Button>
    </form>
  );
};

const ListAdder: React.FC = () => {
  const { createList } = useMutations();
  const [open, setOpen] = React.useState(false);
  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger>
        <Button size="1" variant="soft">
          <i className="fa-solid fa-plus" />
          New list
        </Button>
      </Popover.Trigger>
      <Popover.Content className="grid w-60 gap-4">
        <Heading size="2" as="h2">
          New List
        </Heading>
        <ListAdderForm
          onSubmit={(value) => {
            createList.mutate({ name: value });
            setOpen(false);
          }}
        />
      </Popover.Content>
    </Popover.Root>
  );
};

export default ListAdder;
