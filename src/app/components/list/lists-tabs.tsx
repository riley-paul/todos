import React, { useEffect, useRef, useState } from "react";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { qLists, qTodos } from "@/lib/client/queries";
import { Tabs, Text } from "@radix-ui/themes";
import { useAtom } from "jotai";
import { alertSystemAtom } from "../alert-system/alert-system.store";
import { toast } from "sonner";
import useMutations from "@/app/hooks/use-mutations";
import { zListName, type TodoSelect } from "@/lib/types";
import {
  Link,
  linkOptions,
  useNavigate,
  useParams,
  type LinkOptions,
} from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";
import useIsLinkActive from "@/app/hooks/use-is-link-active";
import { cn, getIsTyping } from "@/lib/client/utils";
import { useAppearance } from "@/app/hooks/use-theme";
import { useEventListener } from "usehooks-ts";

const getTodoLength = (todos: TodoSelect[]) =>
  todos.filter(({ isCompleted }) => !isCompleted).length;

const ListTab: React.FC<{
  name: string;
  value: string;
  todoCount: number;
  linkOptions: LinkOptions;
}> = ({ name, value, linkOptions, todoCount }) => {
  const ref = useRef<HTMLButtonElement>(null);
  const isActive = useIsLinkActive(linkOptions);

  useEffect(() => {
    if (isActive) {
      ref.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
  }, [isActive]);

  return (
    <Link {...linkOptions}>
      <Tabs.Trigger ref={ref} value={value} className="h-8">
        <span className="flex items-center gap-1">
          {name}
          {!isActive && (
            <Text size="1" className="font-mono opacity-70">
              {todoCount}
            </Text>
          )}
        </span>
      </Tabs.Trigger>
    </Link>
  );
};

const ScrollButton: React.FC<{
  show?: boolean;
  direction: "left" | "right";
  listRef: React.RefObject<HTMLDivElement>;
}> = ({ show, listRef, direction }) => {
  const theme = useAppearance();

  const handleClick = () => {
    const scrollAmount = direction === "left" ? -150 : 150;
    listRef.current?.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  return (
    <button
      className={cn(
        "absolute z-20 flex h-[calc(100%-2px)] w-6 items-center justify-center",
        "transition-opacity ease-in",
        {
          "right-0 bg-gradient-to-l": direction === "right",
          "left-0 bg-gradient-to-r": direction === "left",
          "pointer-events-none opacity-0": !show,
          "from-[#142324]": theme === "dark",
          "from-[#feffff]": theme === "light",
        },
      )}
      onClick={handleClick}
    ></button>
  );
};

const ListsTabs: React.FC = () => {
  const [, dispatchAlert] = useAtom(alertSystemAtom);
  const navigate = useNavigate();
  const { createList } = useMutations();

  const listRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  const checkScroll = () => {
    const el = listRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    const maxScrollLeft = scrollWidth - clientWidth;

    setShowLeft(scrollLeft > 0);
    setShowRight(scrollLeft < maxScrollLeft - 1); // small buffer
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  const { listId = "inbox" } = useParams({ strict: false });

  const { data: lists } = useSuspenseQuery(qLists);
  const { data: inboxTodos = [] } = useQuery(qTodos(null));
  const { data: allTodos = [] } = useQuery(qTodos("all"));

  const inboxCount = getTodoLength(inboxTodos);
  const allCount = getTodoLength(allTodos);

  const handleCreateList = () => {
    dispatchAlert({
      type: "open",
      data: {
        type: "input",
        title: "Create New List",
        message: "Enter a name for your new list",
        value: "",
        placeholder: "List name",
        schema: zListName,
        handleSubmit: (name: string) => {
          createList.mutate({ name });
          dispatchAlert({ type: "close" });
          toast.success("List created successfully");
        },
      },
    });
  };

  const moveThroughLists = (direction: "left" | "right") => {
    const linkOptionMap: Map<string, LinkOptions> = new Map();

    linkOptionMap.set("inbox", linkOptions({ to: "/" }));
    linkOptionMap.set(
      "all",
      linkOptions({ to: "/todos/$listId", params: { listId: "all" } }),
    );
    lists.forEach((list) => {
      linkOptionMap.set(
        list.id,
        linkOptions({ to: "/todos/$listId", params: { listId: list.id } }),
      );
    });

    const linkKeys = Array.from(linkOptionMap.keys());
    const currentIndex = linkKeys.indexOf(listId);

    if (direction === "right") {
      const nextIndex = (currentIndex + 1) % linkKeys.length;
      const nextLinkOptions = linkOptionMap.get(linkKeys[nextIndex]);
      if (nextLinkOptions) navigate(nextLinkOptions);
    }

    if (direction === "left") {
      const prevIndex = (currentIndex - 1 + linkKeys.length) % linkKeys.length;
      const prevLinkOptions = linkOptionMap.get(linkKeys[prevIndex]);
      if (prevLinkOptions) navigate(prevLinkOptions);
    }
  };

  useEventListener("keydown", (event) => {
    if (getIsTyping()) return;
    if (event.key === "ArrowRight") {
      moveThroughLists("right");
      return;
    }
    if (event.key === "ArrowLeft") {
      moveThroughLists("left");
      return;
    }
  });

  const touchStartX = useRef<number | null>(null);

  useEventListener("touchstart", (event) => {
    if (getIsTyping()) return;
    if ((event.target as HTMLElement).closest("#tabs-container")) return;

    touchStartX.current = event.touches[0].clientX;
    console.log("touch started");
  });

  useEventListener("touchend", (event) => {
    if (getIsTyping()) return;
    if (touchStartX.current == null) return;
    if ((event.target as HTMLElement).closest("#tabs-container")) return;

    const endX = event.changedTouches[0].clientX;
    const deltaX = endX - touchStartX.current;

    const SWIPE_THRESHOLD = 50; // px

    if (Math.abs(deltaX) > SWIPE_THRESHOLD) {
      // Build the same map used for arrow keys

      if (deltaX < 0) {
        moveThroughLists("right");
      } else {
        moveThroughLists("left");
      }
    }

    touchStartX.current = null;
  });

  return (
    <div id="tabs-container" className="relative w-full">
      <div
        ref={listRef}
        onScroll={checkScroll}
        className="scrollbar-hide flex items-center overflow-auto"
      >
        <ScrollButton direction="left" show={showLeft} listRef={listRef} />

        <Tabs.Root value={listId}>
          <Tabs.List size="1">
            <ListTab
              name="Inbox"
              value="inbox"
              todoCount={inboxCount}
              linkOptions={{ to: "/" }}
            />
            <ListTab
              name="All"
              value="all"
              todoCount={allCount}
              linkOptions={{ to: "/todos/$listId", params: { listId: "all" } }}
            />

            {lists.map((list) => (
              <ListTab
                key={list.id}
                name={list.name}
                value={list.id}
                todoCount={list.todoCount}
                linkOptions={{
                  to: "/todos/$listId",
                  params: { listId: list.id },
                }}
              />
            ))}
            <Tabs.Trigger value="" onClick={handleCreateList}>
              <PlusIcon className="mr-1 size-3 text-accent-10" />
              New List
            </Tabs.Trigger>
          </Tabs.List>
        </Tabs.Root>

        <ScrollButton direction="right" show={showRight} listRef={listRef} />
      </div>
    </div>
  );
};

export default ListsTabs;
