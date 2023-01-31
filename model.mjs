import noteFactory from "./presenter.mjs";
import { zeroAdder } from "./auxiliaryFunctions.mjs";
import entryReader from "./auxiliaryFunctions.mjs";
import noteCommand from "./command.mjs";

class Model {
  constructor() {
    this.observers = [];
  }

  generateID() {
    return localStorage.getItem("i");
  }

  indexInitialization() {
    const visited = localStorage.getItem("0");
    if (!!visited) {
      // When the user refresh the page
      noteCommand.reloadCommand();
    } else {
      // When the user opens the page for the first time
      localStorage.setItem("i", "1");
      // localStorage.setItem("0", "visited");
    }
  }

  modelGetItem(id) {
    return localStorage.getItem(id);
  }

  searchHandler(array) {
    for (let elmnt of Object.entries(localStorage)) {
      // Part 1: All the notes are deleted by default the matches
      //         will create the note.
      if (elmnt[0] !== "0" && elmnt[0] !== "i") {
        let noteToDelete = document.getElementById(elmnt[0]);
        if (noteToDelete) {
          document.body.removeChild(noteToDelete);
        }
      }
    }

    // Part 2: When the input is empty, all the notes
    //         will be shown.
    if (array.length === 0) {
      for (let elmnt of Object.entries(localStorage)) {
        if (elmnt[0] !== "0" && elmnt[0] !== "i") {
          noteFactory(elmnt[0], elmnt[1]);
        }
      }
    }

    // Part 3: The code will create only notes that match the
    //         input.
    for (let elmnt of Object.entries(localStorage)) {
      if (elmnt[0] !== "0" && elmnt[0] !== "i") {
        let text = entryReader(elmnt[1]).text.toUpperCase();
        text = text.split(" ");
        for (let word of array) {
          // console.log(text.indexOf(word.toUpperCase()));
          if (text.indexOf(word.toUpperCase()) !== -1) {
            noteFactory(elmnt[0], elmnt[1]);
          }
        }
      }
    }
  }

  undoAction(command) {
    let action = command.action;
    let id = command.id;

    // Handle the creation event:
    if (action === "noteCreation") {
      let noteToDelete = document.getElementById(id);

      document.body.removeChild(noteToDelete);
      localStorage.removeItem(id);
    }
    // Handle the modification:
    else if (action === "noteModification" || action === "noteMovement") {
      // 1) The code modifies the local storage, with the
      //    values provided in the command.
      // console.log(id, command.entry);
      localStorage.setItem(id, command.entry);
      // 2) The code deletes the "old" element from the DOM
      //    ("old" => element before de -undo- action)
      let noteToDelete = document.getElementById(id);
      document.body.removeChild(noteToDelete);
      // 3) The code creates a new element with the same id
      //    than the one removed in step 2, but with a new
      //    value for the text.
      noteFactory(id, command.entry);
    }
    // Handle the deletion:
    else if (action === "noteDeletion") {
      localStorage.setItem(id, command.entry);
      noteFactory(id, command.entry);
    }
  }

  commandHandler(command) {
    let action = command.action;
    // ----------START: INPUT HANDLER----------

    // Handle the creation event:
    if (action === "noteCreation") {
      let index = Number(localStorage.getItem("i"));
      localStorage.setItem("i", String(index + 1));
      localStorage.setItem("0", "visited");
      // The position:
      let top = 0;
      let left = 400;
      // To format the position:
      top = zeroAdder(top);
      left = zeroAdder(left);

      // The dates:
      let creationDate = new Date();
      creationDate = String(creationDate).substring(0, 24);
      let modificationDate = creationDate;

      // Creation of the entry in the localStorage
      let entry = left + top + creationDate + modificationDate;

      let entryJson = {
        positionX: left,
        positionY: top,
        creationDate: creationDate,
        modificationDate: modificationDate,
      };

      // To add the entry to the model
      // Model.newEntry(JSON.stringify(entryJson));
      // console.log(JSON.stringify(entryJson));

      localStorage.setItem(index, entry);

      // Now the code creates the note
      noteFactory(index, entry);
    }
    // Handle the deletion:
    else if (action === "noteDeletion") {
      let noteToDelete = document.getElementById(command.id);
      document.body.removeChild(noteToDelete);
      localStorage.removeItem(command.id);
    }
    // Handle the modification:
    else if (action === "noteModification") {
      let information = entryReader(command.entry);
      let modificationDate = new Date();
      modificationDate = String(modificationDate).substring(0, 24);
      let newEntry =
        information.coordinates[0] +
        information.coordinates[1] +
        information.creationDate +
        modificationDate +
        information.text;

      localStorage.setItem(command.id, newEntry);
    }
    // Handle the movement:
    else if (action === "noteMovement") {
      let entryStoraged = localStorage.getItem(command.id);
      let information = entryReader(command.entry);
      let newEntry =
        information.coordinates[0] +
        information.coordinates[1] +
        entryStoraged.substring(10, entryStoraged.length);
      localStorage.setItem(command.id, newEntry);
    }

    // Handle the page refresh:
    else if (action === "pageRefresh") {
      for (let elmnt of Object.entries(localStorage)) {
        if (elmnt[0] !== "0" && elmnt[0] !== "i") {
          noteFactory(elmnt[0], elmnt[1]);
        }
      }
    }
  }
  // -----------END: INPUT HANDLER-----------
}

let modelObject = new Model();

export default modelObject;
