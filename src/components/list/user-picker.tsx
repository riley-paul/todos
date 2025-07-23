import { qUsers } from "@/lib/client/queries";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useDebounceValue } from "usehooks-ts";
import { Command } from "cmdk";
import { Spinner, Text, TextField } from "@radix-ui/themes";
import { SearchIcon } from "lucide-react";
import UserBubble from "../ui/user-bubble";
import type { UserSelect } from "@/lib/types";

type Props = {
  isUserDisabled?: (user: UserSelect) => boolean;
};

const UserPicker: React.FC<Props> = ({ isUserDisabled }) => {
  const [isFocused, setIsFocused] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [debouncedSearch, updateDebouncedValue] = useDebounceValue("", 300);

  const { data: userSuggestions = [], isLoading } = useQuery(
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
          <TextField.Root
            placeholder="Search users..."
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          >
            <TextField.Slot side="left">
              <SearchIcon className="size-4 text-accent-10" />
            </TextField.Slot>
          </TextField.Root>
        </Command.Input>

        {isFocused && Boolean(search) && (
          <Command.List className="border-1 absolute z-30 mt-2 max-h-52 w-full overflow-y-auto rounded-2 border bg-gray-1 shadow-3">
            <Spinner loading={isLoading}>
              <Command.Empty>
                <div className="flex items-center justify-center p-6">
                  <Text color="gray" size="2">
                    No users found
                  </Text>
                </div>
              </Command.Empty>
              {userSuggestions.map((user) => (
                <Command.Item
                  key={user.id}
                  value={user.id}
                  disabled={isUserDisabled?.(user)}
                  className="flex items-center gap-2 px-3 py-2 transition-colors data-[disabled=true]:pointer-events-none data-[selected=true]:bg-accent-2 data-[disabled=true]:opacity-50"
                >
                  <UserBubble user={user} size="md" />
                  <div className="flex flex-col">
                    <Text size="2" weight="medium">
                      {user.name}
                    </Text>
                    <Text size="2" color="gray">
                      {user.email}
                    </Text>
                  </div>
                </Command.Item>
              ))}
            </Spinner>
          </Command.List>
        )}
      </div>
    </Command>
  );
};

export default UserPicker;
