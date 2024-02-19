import { useRef, useState } from "react";
import { Overlay, Popover } from "react-bootstrap";
import { Info, X } from "react-feather";
import { DragHandle } from "../DnD/SortableItem";

const MenuInfo: React.FC = () => {
  const [show, setShow] = useState(false);
  const [target, setTarget] = useState(null);
  const ref = useRef(null);

  const handleClick = (event: any) => {
    setShow(!show);
    setTarget(event.target);
  };

  return (
    <div className="ms-2" ref={ref}>
      <Info style={{ cursor: "pointer" }} onClick={handleClick} />

      <Overlay
        show={show}
        target={target}
        placement="bottom"
        container={ref}
        containerPadding={20}
      >
        <Popover id="popover-contained">
          <Popover.Body>
            <ul>
              <li>Clicking an item will expand it for editing</li>
              <li>
                Clicking the <X size={12} /> icon will delete the item{" "}
                <b>permanently</b>
              </li>
              <li>
                Expanding and checking the <em>disabled</em> checkbox will hide
                the item from the menu but allow you to re-enable it later
              </li>
              <li>
                Items can be re-ordered by dragging and dropping with the{" "}
                <DragHandle /> icon
              </li>
              <li>
                Edited items are shown in <em>italic</em>
              </li>
              <li>
                Hidden items are grayed out with a{" "}
                <span className="text-decoration-line-through">
                  strikethrough
                </span>
              </li>
            </ul>
          </Popover.Body>
        </Popover>
      </Overlay>
    </div>
  );
};

export default MenuInfo;
