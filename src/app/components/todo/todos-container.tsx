import useMutations from "@/app/hooks/use-mutations";
import { cn } from "@/lib/client/utils";
import type { ListSelect } from "@/lib/types";
import { Card, Tooltip, IconButton, Heading, Badge } from "@radix-ui/themes";
import { PinIcon, MoreHorizontalIcon } from "lucide-react";
import ListMenu from "../list/list-menu";
import UserBubbleGroup from "../ui/user-bubble-group";

const TodosContainer: React.FC<
  React.PropsWithChildren<{ list: ListSelect }>
> = ({ children, list }) => {
  const { updateList } = useMutations();

  const handleTogglePin = () => {
    updateList.mutate({ id: list.id, data: { isPinned: !list.isPinned } });
  };

  return (
    <Card size="2" className="grid gap-4">
      <header className="flex items-center justify-between gap-4">
        <Heading as="h2" size="4">
          {list.name}
        </Heading>
        <section className="flex items-center gap-2">
          {list.otherUsers && (
            <UserBubbleGroup users={list.otherUsers} numAvatars={3} />
          )}

          <Badge color="gray">{list.todoCount}</Badge>

          {list.id !== "inbox" && list.id !== "all" && (
            <Tooltip content={list.isPinned ? "Unpin List" : "Pin List"}>
              <IconButton
                variant="ghost"
                color="gray"
                onClick={handleTogglePin}
              >
                <PinIcon
                  className={cn("size-4", list.isPinned && "text-amber-9")}
                />
              </IconButton>
            </Tooltip>
          )}

          <ListMenu
            list={list}
            trigger={
              <IconButton size="2" variant="soft" className="!m-0">
                <MoreHorizontalIcon className="size-4" />
              </IconButton>
            }
          />
        </section>
      </header>
      {children}
    </Card>
  );
};

export default TodosContainer;
