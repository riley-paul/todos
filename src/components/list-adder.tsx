import React from "react";
import { Button, Heading, TextField } from "@radix-ui/themes";
import useMutations from "@/hooks/use-mutations";
import ResponsiveModal from "./base/responsive-modal";

type Props = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

const ListAdder: React.FC<Props> = ({ isOpen, setIsOpen }) => {
  const { createList } = useMutations();

  const [value, setValue] = React.useState("");

  return (
    <ResponsiveModal
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        setValue("");
      }}
    >
      <Heading size="3" as="h2">
        New List
      </Heading>
      <form
        className="grid gap-rx-3 sm:grid-cols-[auto_6rem]"
        onSubmit={(e) => {
          e.preventDefault();
          createList.mutate({ name: value });
          setValue("");
          setIsOpen(false);
        }}
      >
        <TextField.Root
          placeholder="New List"
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="flex-1"
        >
          <TextField.Slot side="right">
            <Button size="1" variant="soft" type="submit">
              <i className="fa-solid fa-save" />
              Save
            </Button>
          </TextField.Slot>
        </TextField.Root>
      </form>
    </ResponsiveModal>
  );
};

export default ListAdder;
