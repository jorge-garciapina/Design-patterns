// THIS IS THE PRESENTER LAYER 1. HERE ARE THE REASONS:
// 1) IT MANAGES AN INPUT (THE New note BUTTON)
// 2) IT RENDERS THE VIEW ACCORDINGLY (CREATES A NEW NOTE)
// 3) WHEN IT CREATES THE NOTE, IT CREATE ALSO NEW INPUTS
//    (TEXT, DELETE BUTTON, POSITION)
// 3) THIS INPUTS WILL BE MANAGE BY PRESENTE LAYER 2

import noteCommand from "./command.mjs";
import modelObject from "./model.mjs";

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

    document.addEventListener("mousemove", handleMouseMove);
  });

  document.addEventListener("mouseup", (event) => {
    if (isDragging) {
      isDragging = false;
      document.removeEventListener("mousemove", handleMouseMove);

      // COMMAND:
      let oldEntry = modelObject.getItemJSON(id);
      let newEntry = modelObject.getItemJSON(id);
      newEntry.positionX = parseInt(note.style.left);
      newEntry.positionY = parseInt(note.style.top);
      noteCommand.movementCommand(note.id, newEntry, oldEntry);
    }
  });

  function handleMouseMove(event) {
    if (isDragging) {
      let x = event.clientX - offSetLeft;
      let y = event.clientY - offSetTop;
      note.style.top = y + "px";
      note.style.left = x + "px";
    }
  }
  //-----------  END: MOVEMENT CONTROL -----------

  // -----------START: TEXT-----------
  let textArea = document.createElement("textarea");
  textArea.className = "textArea";
  textArea.value = text;
  textArea.maxLength = 90;

  // Text that counts the words
  let wordCounter = document.createElement("word-counter");
  wordCounter.setAttribute("class", "wordCounter");
  let charNum = textArea.value.length;
  wordCounter.textContent = String(90 - charNum) + "/90";
  note.appendChild(wordCounter);

  // To handle the input of the text area:
  textArea.addEventListener("input", () => {
    let charNum = textArea.value.length;
    wordCounter.textContent = String(90 - charNum) + "/90";

    // ----------Start: JSON format----------
    let oldEntryJSON = modelObject.getItemJSON(id);
    let newEntryJSON = oldEntryJSON;
    newEntryJSON.content = textArea.value;
    // ---------- End: JSON format ----------

    // COMMAND:
    noteCommand.modificationCommand(id, newEntryJSON, oldEntryJSON);
  });

  note.appendChild(textArea);
  // ------------END: TEXT------------

  //-----------  START: TAB CONFIGURATION -----------
  textArea.addEventListener("keydown", function (event) {
    if (event.key === "Tab") {
      event.preventDefault();
      // Commands to retrieve the position
      // of the text selection
      const start = textArea.selectionStart;
      const end = textArea.selectionEnd;

      // Commands to separate the text before
      // and after the text selection
      const inputText = textArea.value;
      let textBefore = inputText.substring(0, start);
      let textAfter = inputText.substring(end, inputText.length);

      // Insertion of the tab character:
      textArea.value = textBefore + "\t" + textAfter;

      // Commands to make the text selection
      // to behave correctly:
      textArea.selectionStart = start + 1;
      textArea.selectionEnd = start + 1;
    }
  });
  //-----------   END: TAB CONFIGURATION  -----------

  // --------START: DELETE BUTTON--------
  let deleteButton = document.createElement("button");
  deleteButton.className = "deleteButton";
  deleteButton.textContent = "Delete note";

  // To handle the click on the delete button:
  deleteButton.onclick = () => {
    // COMMAND:
    let entry = modelObject.getItemJSON(id);
    noteCommand.deletionCommand(id, entry);
  };

  note.appendChild(deleteButton);
  // --------END: DELETE BUTTON--------

  // -------- STAR: INFO BUTTON --------
  let infoButton = document.createElement("button");
  infoButton.className = "deleteButton";
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
