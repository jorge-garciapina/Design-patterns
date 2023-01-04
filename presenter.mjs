// THIS IS THE PRESENTER LAYER 1. HERE ARE THE REASONS:
// 1) IT MANAGES AN INPUT (THE New note BUTTON)
// 2) IT RENDERS THE VIEW ACCORDINGLY (CREATES A NEW NOTE)
// 3) WHEN IT CREATES THE NOTE, IT CREATE ALSO NEW INPUTS
//    (TEXT, DELETE BUTTON, POSITION)
// 3) THIS INPUTS WILL BE MANAGE BY PRESENTE LAYER 2

import noteCommand from "./command.mjs";
// import dragMovement from "./movement.mjs";
import entryReader from "./auxiliaryFunctions.mjs";
import { zeroRemover, zeroAdder } from "./auxiliaryFunctions.mjs";

function noteFactory(id, entry) {
  // -------START: NOTE'S BASICS-------
  let note = document.createElement("div");
  note.setAttribute("class", "note");
  note.id = id;
  // --------END: NOTE'S BASICS--------

  // -------START: NOTE INFORMATION-------
  let entryObject = entryReader(entry);
  let text = entryObject.text;
  // -------END: NOTE INFORMATION-------

  //-----------  START: MOVEMENT CONTROL -----------
  //----------- Start: Initial position -----------
  let information = entryReader(entry);
  let left = information.coordinates[0];
  let top = information.coordinates[1];

  let properties = {
    globalTop: zeroRemover(top),
    globalLeft: zeroRemover(left),
  };

  note.setAttribute(
    "style",
    "top:" +
      properties["globalTop"] +
      "px;" +
      "left:" +
      properties["globalLeft"] +
      "px;"
  );
  //------------ End: Initial position -----------

  //----------- Start: Mouse events -----------
  note.addEventListener("mousedown", (data) => {
    note.addEventListener("mousemove", dragMovement);
  });
  note.addEventListener("mouseup", (data) => {
    let newCoordinates =
      zeroAdder(properties["globalLeft"]) + zeroAdder(properties["globalTop"]);
    let newEntry = newCoordinates + entry.substring(10, entry.length);
    let oldEntry = localStorage.getItem(id);
    // COMMAND:
    noteCommand.movementCommand(note.id, newEntry, oldEntry);
    note.removeEventListener("mousemove", dragMovement);
  });
  //----------- End: Mouse events -----------

  //----------- Start: Movement function-----------
  function dragMovement(data) {
    // -styles-, -top- and -left- are values extracted from the div
    // created by the function -newDiv- defined above.
    let styles = getComputedStyle(note);
    let top = parseInt(styles.top);
    let left = parseInt(styles.left);

    // -data.movementX- and -data.movementY- evaluates the movement
    // of the mouse. By adding those values to the properties
    // of the div, the div moves relative to the mouse.
    properties["globalTop"] = top + data.movementY;
    properties["globalLeft"] = left + data.movementX;

    note.setAttribute(
      "style",
      "top:" +
        String(properties["globalTop"]) +
        "px;" +
        "left:" +
        String(properties["globalLeft"]) +
        "px;"
    );
  }
  //----------- End: Movement function-----------

  //-----------  END: MOVEMENT CONTROL -----------

  // -----------START: TEXT-----------
  let textArea = document.createElement("textarea");
  textArea.setAttribute("class", "textArea");
  textArea.value = text;
  textArea.maxLength = 90;

  // Text that counts the words
  let wordCounter = document.createElement("word-counter");
  wordCounter.setAttribute("class", "wordCounter");
  let charNum = textArea.value.length;
  wordCounter.innerHTML = String(90 - charNum) + "/90";
  note.appendChild(wordCounter);

  // To handle the input of the text area:
  textArea.addEventListener("input", () => {
    let charNum = textArea.value.length;
    wordCounter.innerHTML = String(90 - charNum) + "/90";
    // COMMAND:

    let oldEntry = localStorage.getItem(id);

    let information = entryReader(oldEntry);
    console.log(information);
    let newEntry =
      information.coordinates[0] +
      information.coordinates[1] +
      information.creationDate +
      information.modificationDate +
      textArea.value;

    noteCommand.modificationCommand(id, newEntry, oldEntry);
  });

  note.appendChild(textArea);
  // ------------END: TEXT------------

  // --------START: DELETE BUTTON--------
  let deleteButton = document.createElement("button");
  deleteButton.setAttribute("class", "deleteButton");
  deleteButton.innerHTML = "Delete note";

  // To handle the click on the delete button:
  deleteButton.onclick = () => {
    // COMMAND:
    let entry = localStorage.getItem(id);
    noteCommand.deletionCommand(id, entry);
  };

  note.appendChild(deleteButton);

  // --------END: DELETE BUTTON--------

  // Append the note to the DOM:
  document.body.appendChild(note);
}
// -------------END: NOTE'S CREATION---------------

export default noteFactory;
