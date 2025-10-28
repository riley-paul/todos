import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Command } from "cmdk";
import {
  Badge,
  IconButton,
  Popover,
  Spinner,
  Text,
  TextField,
} from "@radix-ui/themes";
import { SearchIcon, XIcon } from "lucide-react";
import UserBubble from "../ui/user-bubble";
import { useDebounceValue } from "usehooks-ts";
import { qUsers } from "@/app/lib/queries";

type Props = {
  search: string;
  setSearch: (search: string) => void;
  selectedUserId: string;
  setSelectedUserId: (userId: string) => void;
  isUserDisabled?: (userId: string) => boolean;
};

const UserSearch: React.FC<Props> = ({
  search,
  setSearch,
  selectedUserId,
  setSelectedUserId,
  isUserDisabled,
}) => {
  const [showMenu, setShowMenu] = React.useState(false);

  const [debouncedSearch, updateDebouncedValue] = useDebounceValue(search, 300);

  const { data: userSuggestions = [], isLoading } = useQuery(
    qUsers(debouncedSearch),
  );

  const selectedUser = userSuggestions.find(
    (user) => user.id === selectedUserId,
  );

  if (selectedUser) {
    return (
      <Badge size="3" variant="surface" className="h-full">
        <UserBubble user={selectedUser} avatarProps={{ size: "1" }} />
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
    <Popover.Root open={showMenu} onOpenChange={setShowMenu}>
      <Command>
        <Popover.Trigger>
          <div>
            <Command.Input
              asChild
              value={search}
              onValueChange={(value) => {
                setSearch(value);
                updateDebouncedValue(value);
              }}
            >
              <TextField.Root
                size="3"
                placeholder="Search users..."
                onChange={() => setShowMenu(true)}
                // onFocus={() => setShowMenu(true)}
              >
                <TextField.Slot side="left">
                  <SearchIcon className="text-accent-10 size-4" />
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
          </div>
        </Popover.Trigger>

        <Popover.Content
          className="max-h-80 py-1"
          style={{ width: "300px" }}
          side="bottom"
          align="start"
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <Command.List>
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
                  value={`${user.name} ${user.email}`}
                  onSelect={() => setSelectedUserId(user.id)}
                  disabled={isUserDisabled?.(user.id)}
                  className="data-[selected=true]:bg-accent-3 rounded-3 -mx-3 flex cursor-default items-center gap-2 px-3 py-2 transition-colors select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50"
                >
                  <UserBubble user={user} avatarProps={{ size: "2" }} />
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
        </Popover.Content>
      </Command>
    </Popover.Root>
  );
};

export default UserSearch;
