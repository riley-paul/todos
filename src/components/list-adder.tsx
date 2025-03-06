import React from "react";
import { Button, Popover, type ButtonProps } from "@radix-ui/themes";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { Link } from "@tanstack/react-router";
import ListAdderForm from "./list-adder-form";

const BUTTON_PROPS: ButtonProps = {
  variant: "soft",
  size: "1",
  color: "gray",
};

const ButtonChild = () => (
  <>
    <i className="fa-solid fa-plus text-accent-10" />
    New list
  </>
);

const ListAdder: React.FC = () => {
  const isMobile = useIsMobile(512);
  const [open, setOpen] = React.useState(false);

  if (isMobile || true) {
    return (
      <Button asChild {...BUTTON_PROPS}>
        <Link to="/todos/new">
          <ButtonChild />
        </Link>
      </Button>
    );
  }

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger>
        <Button {...BUTTON_PROPS}>
          <ButtonChild />
        </Button>
      </Popover.Trigger>
      <Popover.Content className="grid w-72 gap-4" align="center">
        <ListAdderForm onSuccess={() => setOpen(false)} />
      </Popover.Content>
    </Popover.Root>
  );
};

export default ListAdder;
