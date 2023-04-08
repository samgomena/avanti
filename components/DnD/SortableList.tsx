import type { Active, UniqueIdentifier } from "@dnd-kit/core";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import type { ReactNode } from "react";
import React, { useMemo, useState } from "react";

import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { DragHandle, SortableItem } from "./SortableItem";
import SortableOverlay from "./SortableOverlay";

interface BaseItem {
  id: UniqueIdentifier;
}

interface SortableListProps<T extends BaseItem> {
  items: T[];
  onChange(activeIndex: number, overIndex: number): void;
  renderItem(item: T): ReactNode;
}

export function SortableList<T extends BaseItem>({
  items,
  onChange,
  renderItem,
}: SortableListProps<T>) {
  const [active, setActive] = useState<Active | null>(null);
  const activeItem = useMemo(
    () => items.find((item) => item.id === active?.id),
    [active, items]
  );
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <DndContext
      sensors={sensors}
      modifiers={[restrictToVerticalAxis]}
      onDragStart={({ active }) => setActive(active)}
      onDragEnd={({ active, over }) => {
        if (over && active.id !== over?.id) {
          const activeIndex = items.findIndex(({ id }) => id === active.id);
          const overIndex = items.findIndex(({ id }) => id === over.id);
          onChange(activeIndex, overIndex);
        }
        setActive(null);
      }}
      onDragCancel={() => setActive(null)}
    >
      <SortableContext items={items}>
        <ul role="application">
          {items.map((item) => (
            <React.Fragment key={item.id}>{renderItem(item)}</React.Fragment>
          ))}
        </ul>
      </SortableContext>
      <SortableOverlay>
        {activeItem ? renderItem(activeItem) : null}
      </SortableOverlay>
    </DndContext>
  );
}

SortableList.Item = SortableItem;
SortableList.DragHandle = DragHandle;
