// THIS IS THE PRESENTER LAYER 1. HERE ARE THE REASONS:
// 1) IT MANAGES AN INPUT (THE New note BUTTON)
// 2) IT RENDERS THE VIEW ACCORDINGLY (CREATES A NEW NOTE)
// 3) WHEN IT CREATES THE NOTE, IT CREATE ALSO NEW INPUTS
//    (TEXT, DELETE BUTTON, POSITION)
// 3) THIS INPUTS WILL BE MANAGE BY PRESENTE LAYER 2

import modelObject from "./model.mjs";
import { manageCharacterCounterInNote } from "./presenter.js";
import { manageTabInNote } from "./presenter.js";
import { sendModificationCommand } from "./presenter.js";
import { sendMovementCommand } from "./presenter.js";
import { sendDeletionCommand } from "./presenter.js";

function noteFactory(id, entry) {
  // The -entry- object contains all the relevant note's information:
  // let entry = {
  //   positionX: *left position*,
  //   positionY: *top position*,
  //   creationDate: *Date of creation*,
  //   modificationDate: *Date of modification*,
  //   content: *Text inside the note*,
  // };

  // -------START: NOTE'S BASICS-------
  let note = document.createElement("template");
  note.className = "note";
  note.id = id;
  // --------END: NOTE'S BASICS--------

  // -------START: NOTE INFORMATION-------
  // let entryObject = entryReader(entry);
  let text = entry.content;
  // -------END: NOTE INFORMATION-------

  //-----------  START: MOVEMENT CONTROL -----------
  //----------- Start: Initial position -----------
  // This part is used to  manage the page refresh
  note.style.top = entry.positionY + "px";
  note.style.left = entry.positionX + "px";
  // //------------ End: Initial position -----------

  // -isDragging- is a flag that prevents errors in the movement
  // it is used to guarantee that only one note can be dragged at
  // the same time.
  let isDragging = false;

  // -offSetLeft- and -offSetTop- are used to manage the offset
  // of the mousedown event.
  let offSetLeft;
  let offSetTop;
  note.addEventListener("mousedown", (event) => {
    isDragging = true;
    offSetLeft = event.offsetX;
    offSetTop = event.offsetY;
    console.log(offSetLeft, offSetTop);

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
  //-----------  END: MOVEMENT CONTROL -----------

  // -----------START: TEXT-----------
  let textArea = document.createElement("textarea");
  textArea.className = "text-area";
  textArea.value = text;
  textArea.maxLength = 90;

  // Text that counts the words
  let notesCharacterCounter = document.createElement("template");
  notesCharacterCounter.className = "notes-character-counter";

  manageCharacterCounterInNote(textArea, notesCharacterCounter);

  note.appendChild(notesCharacterCounter);
  note.appendChild(textArea);

  // To handle the input of the text area:
  textArea.addEventListener("input", () => {
    manageCharacterCounterInNote(textArea, notesCharacterCounter);
    sendModificationCommand(textArea, id);
  });
  // ------------END: TEXT------------

  //-----------  START: TAB CONFIGURATION -----------
  textArea.addEventListener("keydown", function (event) {
    manageTabInNote(textArea, notesCharacterCounter, event);
    sendModificationCommand(textArea, id);
  });
  //-----------   END: TAB CONFIGURATION  -----------

  // --------START: DELETE BUTTON--------
  let deleteButton = document.createElement("button");
  deleteButton.className = "note-button";
  deleteButton.textContent = "Delete note";

  // To handle the click on the delete button:
  deleteButton.onclick = () => {
    sendDeletionCommand(id);
  };

  note.appendChild(deleteButton);
  // --------END: DELETE BUTTON--------

  // -------- STAR: INFO BUTTON --------
  let infoButton = document.createElement("button");
  infoButton.className = "note-button";
  infoButton.textContent = "Info";
  infoButton.onclick = () => {
    let object = modelObject.getItemJSON(id);
    alert(
      "Creation date: " +
        object.creationDate +
        "\nLast modified: " +
        object.modificationDate
    );
  };
  note.appendChild(infoButton);
  // -------- END: INFO BUTTON ---------

  // Append the note to the DOM:
  document.body.appendChild(note);
}
// -------------END: NOTE'S CREATION---------------

export default noteFactory;
