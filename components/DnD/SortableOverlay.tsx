import type { PropsWithChildren } from "react";
import { DragOverlay, defaultDropAnimationSideEffects } from "@dnd-kit/core";
import type { DropAnimation } from "@dnd-kit/core";

const dropAnimationConfig: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: "0.4",
      },
    },
  }),
};

interface Props {}

const SortableOverlay: React.FC<PropsWithChildren<Props>> = ({ children }) => {
  return (
    <DragOverlay dropAnimation={dropAnimationConfig}>{children}</DragOverlay>
  );
};

export default SortableOverlay;
