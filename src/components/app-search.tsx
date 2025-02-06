import React from "react";

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { IconButton, Kbd, Tooltip } from "@radix-ui/themes";
import { useEventListener } from "usehooks-ts";

const AppSearch: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  useEventListener("keydown", (event) => {
    if (event.key === "k" && event.metaKey) {
      event.preventDefault();
      setIsOpen(true);
    }
  });

  return (
    <>
      <Tooltip
        content={
          <div>
            Search <Kbd>⌘ + K</Kbd>
          </div>
        }
        side="bottom"
        align="center"
      >
        <IconButton
          variant="soft"
          radius="full"
          onClick={() => setIsOpen(true)}
        >
          <i className="fas fa-search" />
        </IconButton>
      </Tooltip>
      <CommandDialog open={true} onOpenChange={setIsOpen}>
        <Command>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              <CommandItem>
                <i className="fas fa-calendar" />
                <span>Calendar</span>
              </CommandItem>
              <CommandItem>
                <i className="fas fa-smile" />
                <span>Search Emoji</span>
              </CommandItem>
              <CommandItem disabled>
                <i className="fas fa-calculator" />
                <span>Calculator</span>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Settings">
              <CommandItem>
                <i className="fas fa-user" />
                <span>Profile</span>
                <CommandShortcut>⌘P</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <i className="fas fa-money-bill" />
                <span>Billing</span>
                <CommandShortcut>⌘B</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <i className="fas fa-gear" />
                <span>Settings</span>
                <CommandShortcut>⌘S</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
};

export default AppSearch;
