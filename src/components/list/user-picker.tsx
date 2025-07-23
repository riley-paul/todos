import { qUsers } from "@/lib/client/queries";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useDebounceValue } from "usehooks-ts";
import { Command } from "cmdk";
import { Badge, IconButton, Spinner, Text, TextField } from "@radix-ui/themes";
import { SearchIcon, XIcon } from "lucide-react";
import UserBubble from "../ui/user-bubble";
import type { UserSelect } from "@/lib/types";

type Props = {
  search: string;
  setSearch: (search: string) => void;
  selectedUserId: string;
  setSelectedUserId: (userId: string) => void;
  isUserDisabled?: (user: UserSelect) => boolean;
};

const UserPicker: React.FC<Props> = ({
  search,
  setSearch,
  selectedUserId,
  setSelectedUserId,
  isUserDisabled,
}) => {
  const [isFocused, setIsFocused] = React.useState(true);
  const [showMenu, setShowMenu] = React.useState(isFocused);

  const [debouncedSearch, updateDebouncedValue] = useDebounceValue(search, 300);

  const { data: userSuggestions = [], isLoading } = useQuery(
    qUsers(debouncedSearch),
  );

  const selectedUser = userSuggestions.find(
    (user) => user.id === selectedUserId,
  );

  React.useEffect(() => {
    if (isFocused) setShowMenu(true);
    else setTimeout(() => setShowMenu(false), 200);
  }, [isFocused, setShowMenu]);

  if (selectedUser) {
    return (
      <Badge size="3" variant="surface" className="h-full">
        <UserBubble user={selectedUser} size="sm" />
        <span className="flex-1">{selectedUser.name}</span>
        <IconButton
          variant="ghost"
          size="1"
          radius="full"
          onClick={() => setSelectedUserId("")}
          aria-label="Clear selected user"
        >
          <XIcon className="size-4" />
        </IconButton>
      </Badge>
    );
  }

  return (
    <div className="relative">
      <Command loop shouldFilter={false}>
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
            {Boolean(search) && (
              <TextField.Slot side="right">
                <IconButton
                  variant="ghost"
                  color="gray"
                  size="1"
                  radius="full"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                >
                  <XIcon className="size-4" />
                </IconButton>
              </TextField.Slot>
            )}
          </TextField.Root>
        </Command.Input>

        {showMenu && Boolean(search) && (
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
                  onSelect={setSelectedUserId}
                  disabled={isUserDisabled?.(user)}
                  className="flex cursor-default select-none items-center gap-2 px-3 py-2 transition-colors data-[disabled=true]:pointer-events-none data-[selected=true]:bg-accent-2 data-[disabled=true]:opacity-50"
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
      </Command>
    </div>
  );
};

export default UserPicker;
