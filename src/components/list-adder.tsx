import React from "react";
import {
  Button,
  Heading,
  Popover,
  TextField,
  type ButtonProps,
} from "@radix-ui/themes";
import useMutations from "@/hooks/use-mutations";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { Drawer, DrawerContent, DrawerTrigger } from "./ui/drawer";

const ListAdderTrigger = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    return (
      <Button ref={ref} size="1" variant="soft" color="gray" {...props}>
        <i className="fa-solid fa-plus text-accent-10" />
        New list
      </Button>
    );
  },
);

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
      <Heading size="3" as="h2" mb="2">
        New List
      </Heading>
      <TextField.Root
        ref={(ref) => setTimeout(() => ref?.focus(), 200)}
        placeholder="Unnamed List"
        minLength={1}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <input type="submit" hidden />
      <Button size="2" variant="soft" type="submit">
        <i className="fa-solid fa-save" />
        Save
      </Button>
    </form>
  );
};

const ListAdder: React.FC = () => {
  const { createList } = useMutations();
  const isMobile = useIsMobile(512);
  const [open, setOpen] = React.useState(false);

  const onSubmit = (value: string) => {
    createList.mutate({ name: value }, { onSuccess: () => setOpen(false) });
  };

  if (isMobile) {
    return (
      <>
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>
            <ListAdderTrigger onClick={() => setOpen(true)} />
          </DrawerTrigger>
          <DrawerContent>
            <ListAdderForm onSubmit={onSubmit} />
          </DrawerContent>
        </Drawer>
      </>
    );
  }

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger>
        <ListAdderTrigger />
      </Popover.Trigger>
      <Popover.Content className="grid w-60 gap-4">
        <ListAdderForm onSubmit={onSubmit} />
      </Popover.Content>
    </Popover.Root>
  );
};

export default ListAdder;
