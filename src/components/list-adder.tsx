import React from "react";
import { Button, Popover } from "@radix-ui/themes";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { Link } from "@tanstack/react-router";
import ListAdderForm from "./list-adder-form";

const ListAdder: React.FC = () => {
  const isMobile = useIsMobile(512);
  const [open, setOpen] = React.useState(false);

  if (isMobile) {
    return (
      <Button asChild size="1" variant="soft" color="gray">
        <Link to="/todos/new">
          <i className="fa-solid fa-plus text-accent-10" />
          New list
        </Link>
      </Button>
    );
  }

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger>
        <Button size="1" variant="soft" color="gray">
          <i className="fa-solid fa-plus text-accent-10" />
          New list
        </Button>
      </Popover.Trigger>
      <Popover.Content className="grid w-72 gap-4" align="center">
        <ListAdderForm onSuccess={() => setOpen(false)} />
      </Popover.Content>
    </Popover.Root>
  );
};

export default ListAdder;
