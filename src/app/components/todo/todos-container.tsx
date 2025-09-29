import type { ListSelect } from "@/lib/types";
import { Card, IconButton, Heading, Badge } from "@radix-ui/themes";
import { MoreHorizontalIcon } from "lucide-react";
import ListMenu from "../list/list-menu";
import UserBubbleGroup from "../ui/user-bubble-group";

const TodosContainer: React.FC<
  React.PropsWithChildren<{ list: ListSelect }>
> = ({ children, list }) => {
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
