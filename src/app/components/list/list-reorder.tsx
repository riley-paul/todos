import React, { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  TouchSensor,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { ListSelect } from "@/lib/types";
import {
  Badge,
  Button,
  Dialog,
  IconButton,
  Separator,
  Text,
} from "@radix-ui/themes";
import {
  ArrowDownIcon,
  ArrowUpDownIcon,
  ChevronsUpDownIcon,
  HourglassIcon,
} from "lucide-react";
import { cn } from "@/app/lib/utils";
import ResponsiveDialogContent from "../ui/responsive-dialog-content";
import useMutations from "@/app/hooks/use-mutations";
import { Link } from "@tanstack/react-router";
import { LIST_SEPARATOR_ID } from "@/lib/constants";
import UserBubbleGroup from "../ui/user-bubble-group";

type SortableObjectData =
  | {
      type: "list";
      id: string;
      list: ListSelect;
    }
  | {
      type: "separator";
      id: string;
    };

const getSortableObjectList = (lists: ListSelect[]): SortableObjectData[] => {
  const listToSortableObj = (list: ListSelect): SortableObjectData => ({
    type: "list",
    id: list.id,
    list,
  });

  const separator: SortableObjectData = {
    type: "separator",
    id: LIST_SEPARATOR_ID,
  };

  if (lists.length === 0) return [];
  if (lists.every(({ show }) => show)) {
    return [...lists.map(listToSortableObj), separator];
  }
  if (lists.every(({ show }) => !show)) {
    return [separator, ...lists.map(listToSortableObj)];
  }

  return [
    ...lists.filter(({ show }) => show).map(listToSortableObj),
    separator,
    ...lists.filter(({ show }) => !show).map(listToSortableObj),
  ];
};

type SortableItemProps = SortableObjectData & {
  isDragging?: boolean;
  isOverlay?: boolean;
};

const SortableItem: React.FC<SortableItemProps> = (props) => {
  const { id, isDragging, isOverlay } = props;

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    outline: "none",
    opacity: isDragging ? 0.5 : 1,
  };

  switch (props.type) {
    case "list": {
      const { list } = props;
      return (
        <div ref={setNodeRef} style={style}>
          <article
            className={cn(
              "sm:hover:bg-accent-3 rounded-3 -mx-3 flex h-12 items-center gap-3 px-3 transition-colors ease-in",
              isOverlay && "bg-accent-3",
            )}
          >
            <IconButton
              size="2"
              variant="soft"
              className={cn(
                isOverlay ? "cursor-grabbing" : "cursor-grab",
                "outline-none",
              )}
              {...attributes}
              {...listeners}
            >
              <ChevronsUpDownIcon className="size-5" />
            </IconButton>
            <Dialog.Close>
              <Link
                to="/todos/$listId"
                params={{ listId: list.id }}
                className={cn(
                  "flex h-full flex-1 items-center gap-2",
                  list.isPending && "opacity-50",
                )}
                preload={false}
              >
                <Text
                  truncate
                  size="3"
                  weight="medium"
                  className="flex flex-1 gap-2"
                >
                  <span>{list.name}</span>
                  <span className="font-mono opacity-70">{list.todoCount}</span>
                </Text>
                {list.isPending && (
                  <Badge
                    size="1"
                    className="size-6"
                    variant="outline"
                    color="amber"
                  >
                    <HourglassIcon className="size-3" />
                  </Badge>
                )}
                <UserBubbleGroup users={list.otherUsers} />
              </Link>
            </Dialog.Close>
          </article>
        </div>
      );
    }

    case "separator": {
      return (
        <div ref={setNodeRef} style={style}>
          <article
            {...attributes}
            {...listeners}
            className={cn(
              "rounded-3 sm:hover:bg-accent-3 -mx-3 flex cursor-grab items-center gap-2 px-3 py-1",
              isOverlay && "bg-accent-3 cursor-grabbing",
            )}
          >
            <section className="flex items-center gap-1">
              <ArrowDownIcon className="size-3 opacity-70" />
              <Text size="1" className="uppercase" weight="bold" color="gray">
                Hidden
              </Text>
            </section>
            <Separator orientation="horizontal" size="4" className="h-[2px]" />
          </article>
        </div>
      );
    }
  }
};

type ListReorderContentProps = { lists: ListSelect[] };

const ListReorderContent: React.FC<ListReorderContentProps> = ({ lists }) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [localObjs, setLocalObjs] = useState(getSortableObjectList(lists));

  useEffect(() => setLocalObjs(getSortableObjectList(lists)), [lists]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const { updateListSortShow } = useMutations();

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const ids = localObjs.map(({ id }) => id);
      const oldIndex = ids.indexOf(active.id as string);
      const newIndex = ids.indexOf(over.id as string);

      const newOrder = arrayMove(ids, oldIndex, newIndex);

      setLocalObjs((prev) => arrayMove(prev, oldIndex, newIndex));
      return updateListSortShow.mutate({ listIds: newOrder });
    }
  };

  const activeObj = localObjs.find(({ id }) => id === activeId);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={localObjs} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-1">
          {localObjs.map((obj) => (
            <SortableItem
              key={obj.id}
              isDragging={obj.id === activeId}
              {...obj}
            />
          ))}
        </div>
      </SortableContext>

      <DragOverlay>
        {activeObj ? <SortableItem {...activeObj} isOverlay /> : null}
      </DragOverlay>
    </DndContext>
  );
};

type ListReorderProps = {
  lists: ListSelect[];
};

const ListReorder: React.FC<ListReorderProps> = ({ lists }) => {
  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <IconButton className="size-7" size="1" variant="soft">
          <ArrowUpDownIcon className="size-4" />
        </IconButton>
      </Dialog.Trigger>
      <ResponsiveDialogContent title="Reorder Lists" desktopDrawer>
        <header>
          <Dialog.Title>Reorder Lists</Dialog.Title>
          <Dialog.Description size="2" color="gray">
            Drag and drop lists to reorder them. Move the separator around to
            hide lists below it.
          </Dialog.Description>
        </header>
        <article className="-mx-6 flex h-full flex-col gap-1 overflow-x-hidden overflow-y-auto px-6">
          <ListReorderContent lists={lists} />
        </article>
        <Dialog.Close>
          <Button size="3" variant="soft" className="w-full">
            Done
          </Button>
        </Dialog.Close>
      </ResponsiveDialogContent>
    </Dialog.Root>
  );
};

export default ListReorder;
