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
    <VaulDrawer isOpen={isOpen} setIsOpen={setIsOpen} title="Add a New List">
      <form
        className="grid gap-4"
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
          size="3"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <div className="grid grid-cols-2 justify-end gap-rx-2 sm:flex">
          <Button variant="soft" color="gray" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button variant="solid" type="submit">
            <Save className="size-4" />
            Save
          </Button>
        </div>
      </form>
    </VaulDrawer>
  );
};

export default ListAdder;
