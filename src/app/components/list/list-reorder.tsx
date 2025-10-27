import React from "react";
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
import { Button, Dialog, IconButton, VisuallyHidden } from "@radix-ui/themes";
import { ArrowUpDownIcon, GripVerticalIcon } from "lucide-react";
import { cn } from "@/app/lib/utils";
import ResponsiveDialogContent from "../ui/responsive-dialog-content";
import useMutations from "@/app/hooks/use-mutations";

type SortableContentProps = {
  list: ListSelect;
  isOverlay?: boolean;
};

const SortableContent: React.FC<SortableContentProps> = ({
  list,
  isOverlay,
}) => {
  return (
    <article
      className={cn(
        "hover:bg-accent-3 rounded-3 -mx-3 flex cursor-grab items-center gap-2 px-3 py-1.5 transition-colors ease-in",
        isOverlay && "bg-accent-3 cursor-grabbing",
      )}
    >
      <section>
        <GripVerticalIcon className="size-4 opacity-70" />
      </section>
      {list.name}
    </article>
  );
};

type SortableItemProps = {
  id: string;
  list: ListSelect;
  isDragging?: boolean;
};

const SortableItem: React.FC<SortableItemProps> = ({ id, list, isDragging }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    outline: "none",
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <SortableContent list={list} />
    </div>
  );
};

const ListReorderContent: React.FC<{
  lists: ListSelect[];
}> = ({ lists }) => {
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [localLists, setLocalLists] = React.useState(lists);

  React.useEffect(() => setLocalLists(lists), [lists]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 150, tolerance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const { updateUserSettings } = useMutations();

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const listIds = lists.map((list) => list.id);
      const oldIndex = listIds.indexOf(active.id as string);
      const newIndex = listIds.indexOf(over.id as string);
      setLocalLists((prev) => arrayMove(prev, oldIndex, newIndex));

      const newOrder = arrayMove(listIds, oldIndex, newIndex);
      const listOrder: Record<string, number> = Object.fromEntries(
        newOrder.map((id, idx) => [id, idx]),
      );
      return updateUserSettings.mutate({ settingListOrder: listOrder });
    }
  };

  const activeList = lists.find((list) => list.id === activeId);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={lists} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-1">
          {localLists.map((list) => (
            <SortableItem
              key={list.id}
              id={list.id}
              list={list}
              isDragging={list.id === activeId}
            />
          ))}
        </div>
      </SortableContext>

      <DragOverlay>
        {activeList ? <SortableContent list={activeList} isOverlay /> : null}
      </DragOverlay>
    </DndContext>
  );
};

const ListReorder: React.FC<{ lists: ListSelect[] }> = ({ lists }) => {
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
