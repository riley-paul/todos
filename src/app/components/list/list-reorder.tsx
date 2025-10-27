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
  Button,
  Dialog,
  IconButton,
  Separator,
  Text,
  VisuallyHidden,
} from "@radix-ui/themes";
import { ArrowDownIcon, ArrowUpDownIcon, GripVerticalIcon } from "lucide-react";
import { cn } from "@/app/lib/utils";
import ResponsiveDialogContent from "../ui/responsive-dialog-content";
import useMutations from "@/app/hooks/use-mutations";
import { Link } from "@tanstack/react-router";
import { LIST_SEPARATOR_ID } from "@/lib/constants";

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
  const lastShownListIdx = lists
    .map((list, idx) => (list.show ? idx : -1))
    .filter((idx) => idx !== -1)
    .pop();

  return lists
    .map(
      (list): SortableObjectData => ({
        type: "list",
        id: list.id,
        list,
      }),
    )
    .toSpliced(
      lastShownListIdx !== undefined ? lastShownListIdx + 1 : lists.length,
      0,
      {
        type: "separator",
        id: LIST_SEPARATOR_ID,
      },
    );
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
              <GripVerticalIcon className="size-5" />
            </IconButton>
            <Dialog.Close>
              <Link
                to="/todos/$listId"
                params={{ listId: list.id }}
                className="flex h-full flex-1 items-center"
                preload={false}
              >
                <Text truncate size="3" weight="medium">
                  {list.name}
                </Text>
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

  // const [localLists, setLocalLists] = useState(lists);
  // const [localHiddenIdx, setLocalHiddenIdx] = useState(hiddenIdx);

  // useEffect(() => setLocalLists(lists), [lists]);
  // useEffect(() => setLocalHiddenIdx(hiddenIdx), [hiddenIdx]);

  const sortableObjects = getSortableObjectList(lists);

  useEffect(() => {
    console.log("sortableObjects", sortableObjects);
  }, [sortableObjects]);

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
      const ids = sortableObjects.map(({ id }) => id);
      const oldIndex = ids.indexOf(active.id as string);
      const newIndex = ids.indexOf(over.id as string);

      const newOrder = arrayMove(ids, oldIndex, newIndex);

      // setLocalLists((prev) => arrayMove(prev, oldIndex, newIndex));

      return updateListSortShow.mutate({ listIds: newOrder });
    }
  };

  const activeObj = sortableObjects.find(({ id }) => id === activeId);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={sortableObjects}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-1">
          {sortableObjects.map((obj) => (
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
      <ResponsiveDialogContent title="Reorder Lists">
        <Dialog.Title trim="end">Reorder Lists</Dialog.Title>
        <VisuallyHidden>
          <Dialog.Description>
            Drag and drop the lists to reorder them.
          </Dialog.Description>
        </VisuallyHidden>
        <article className="-mx-6 flex h-full flex-col gap-1 overflow-x-hidden overflow-y-auto px-6">
          <ListReorderContent lists={lists} />
        </article>
        <footer className="flex justify-end">
          <Dialog.Close>
            <Button size="3" variant="soft" className="flex-1 sm:flex-0">
              Done
            </Button>
          </Dialog.Close>
        </footer>
      </ResponsiveDialogContent>
    </Dialog.Root>
  );
};

export default ListReorder;
