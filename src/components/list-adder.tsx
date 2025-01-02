import React from "react";
import VaulDrawer from "./base/vaul-drawer";
import { Button, TextField } from "@radix-ui/themes";
import { Save } from "lucide-react";
import useMutations from "@/hooks/use-mutations";

type Props = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

const ListAdder: React.FC<Props> = ({ isOpen, setIsOpen }) => {
  const { createList } = useMutations();

  const [value, setValue] = React.useState("");

  return (
    <VaulDrawer
      isOpen={isOpen}
      setIsOpen={(open) => {
        setIsOpen(open);
        setValue("");
      }}
      title="Add a New List"
    >
      <form
        className="grid grid-cols-[auto_8rem] gap-rx-3"
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
        />
        <Button variant="solid" type="submit">
          <Save className="size-4" />
          Save
        </Button>
      </form>
    </VaulDrawer>
  );
};

export default ListAdder;
