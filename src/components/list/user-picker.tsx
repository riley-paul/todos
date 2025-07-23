import { qUsers } from "@/lib/client/queries";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useDebounceValue } from "usehooks-ts";
import { Command } from "cmdk";
import { Spinner, Text, TextField } from "@radix-ui/themes";
import { SearchIcon } from "lucide-react";
import type { ClassValue } from "clsx";

type Props = {};

const UserPicker: React.FC<Props> = ({}) => {
  const [search, setSearch] = React.useState("");
  const [debouncedSearch, updateDebouncedValue] = useDebounceValue("", 300);

  React.useEffect(() => {
    console.log("Search value changed:", search);
  }, [search]);

  const { data: userSuggestions = [], loading } = useQuery(
    qUsers(debouncedSearch),
  );

  return (
    <Command shouldFilter={false} loop>
      <div className="relative">
        <Command.Input
          asChild
          value={search}
          onValueChange={(value) => {
            setSearch(value);
            updateDebouncedValue(value);
          }}
        >
          <TextField.Root>
            <TextField.Slot side="left">
              <SearchIcon className="size-4 text-accent-10" />
            </TextField.Slot>
          </TextField.Root>
        </Command.Input>

        {/* <Command.List className="absolute z-30 mt-2 max-h-96 w-full overflow-y-auto rounded-2 border border-1 bg-gray-1 px-2 py-1 shadow-3">
          <Command.Empty>
            <Text color="gray" size="2">
              No users found
            </Text>
          </Command.Empty>
          {loading && (
            <Command.Loading>
              <Spinner />
            </Command.Loading>
          )}
          {userSuggestions.map((user) => (
            <Command.Item
              key={user.id}
              value={user.id}
              className="flex items-center gap-2 px-2 py-1 hover:bg-gray-2"
            >
              <Text size="2">{user.name}</Text>
            </Command.Item>
          ))}
        </Command.List> */}
      </div>
    </Command>
  );
};

export default UserPicker;
