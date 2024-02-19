import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { HelpCircle, X } from "react-feather";
import { DragHandle } from "../DnD/SortableItem";

const HelpModal: React.FC = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  return (
    <>
      <div
        style={{ bottom: "1rem", left: "1rem", cursor: "pointer" }}
        className="position-fixed p-2"
        onClick={() => setShow(true)}
      >
        <HelpCircle size={28} />
      </div>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Help! How does this thing work?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ul>
            <li>
              You can search for items by their name or description using the
              search bar
              <div style={{ fontSize: "0.8rem" }}>
                <em>
                  Note: Item names with diacritics (i.e. saut<b>é</b>ed) have to
                  be searched for literally
                </em>
              </div>
            </li>
            <li>
              Items can be filtered by course using the toggles under the search
              bar. Additionally, you can hide disabled items.
            </li>
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
        </Modal.Body>
      </Modal>
    </>
  );
};

export default HelpModal;
