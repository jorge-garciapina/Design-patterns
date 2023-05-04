import modelObject from "./model.mjs";
import { manageCharacterCounterInNote } from "./presenter.js";
import { manageTabInNote } from "./presenter.js";
import { sendModificationCommand } from "./presenter.js";
import { sendMovementCommand } from "./presenter.js";
import { sendDeletionCommand } from "./presenter.js";

function noteFactory(id, entry) {
  // Get the template and create a clone
  const noteTemplate = document.getElementById("note-template");
  const noteFragment = noteTemplate.content.cloneNode(true);
  const note = noteFragment.querySelector(".note");

  // Set the id and initial styles
  note.id = id;
  note.style.top = entry.positionY + "px";
  note.style.left = entry.positionX + "px";

  // Get elements from the template
  const textArea = note.querySelector(".text-area");
  const notesCharacterCounter = note.querySelector(".notes-character-counter");
  const deleteButton = note.querySelector(".delete-button");
  const infoButton = note.querySelector(".info-button");

  // Set the initial text for the textarea
  textArea.value = entry.content;

  // Movement control, event listeners, and other code
  let isDragging = false;

  let offSetLeft;
  let offSetTop;
  note.addEventListener("mousedown", (event) => {
    isDragging = true;
    offSetLeft = event.offsetX;
    offSetTop = event.offsetY;

    document.addEventListener("mousemove", handleMouseMove);
  });

  document.addEventListener("mouseup", () => {
    if (isDragging) {
      isDragging = false;
      document.removeEventListener("mousemove", handleMouseMove);
      let noteLeftPosition = note.style.left;
      let noteTopPosition = note.style.top;

      sendMovementCommand(note.id, noteLeftPosition, noteTopPosition);
    }
  });

  function handleMouseMove(event) {
    if (isDragging) {
      let x = event.clientX - offSetLeft;
      let y = event.clientY - offSetTop;
      note.style.top = y - 24 + "px";
      note.style.left = x - 24 + "px";
    }
  }

  // To handle the input of the text area:
  textArea.addEventListener("input", () => {
    manageCharacterCounterInNote(textArea, notesCharacterCounter);
    sendModificationCommand(textArea, id);
  });

  // Text that counts the words
  manageCharacterCounterInNote(textArea, notesCharacterCounter);

  // To handle the Tab key in the text area:
  textArea.addEventListener("keydown", function (event) {
    manageTabInNote(textArea, notesCharacterCounter, event);
    sendModificationCommand(textArea, id);
  });

  // To handle the click on the delete button:
  deleteButton.onclick = () => {
    sendDeletionCommand(id);
  };

  // To handle the click on the info button:
  infoButton.onclick = () => {
    let object = modelObject.getItemJSON(id);
    alert(
      "Creation date: " +
        object.creationDate +
        "\nLast modified: " +
        object.modificationDate
    );
  };

  // Append the note to the DOM:
  document.body.appendChild(note);
}
// -------------END: NOTE'S CREATION---------------

export class DomHandler {
  deleteAllNotes() {
    let notes = Array.from(document.getElementsByClassName("note"));
    notes.forEach((element) => element.remove());
  }

  deleteNoteById(id) {
    let noteToDelete = document.getElementById(id);
    document.body.removeChild(noteToDelete);
  }

  createNote(id, noteData) {
    noteFactory(id, noteData);
  }
}

export default noteFactory;
