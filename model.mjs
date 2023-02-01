import noteFactory from "./presenter.mjs";

class Model {
  constructor() {
    this.observers = [];
  }

  generateID() {
    return localStorage.getItem("i");
  }

  indexInitialization() {
    localStorage.setItem("i", "1");
  }

  modelGetItem(id) {
    return localStorage.getItem(id);
  }

  getItemJSON(id) {
    let entries = localStorage.getItem("entries");
    let parsedEntries = JSON.parse(entries);
    return parsedEntries[id];
  }

  searchHandler(text) {
    let entries = localStorage.getItem("entries");
    let parsedEntries = JSON.parse(entries);

    // Part 1: The code delete all notes
    // (Notes will be created if match the search)
    (function () {
      let notes = Array.from(document.getElementsByClassName("note"));
      notes.forEach((element) => element.remove());
    })();

    // Part 2: When the input is empty, all the notes will be shown.
    for (let elmnt of Object.entries(parsedEntries)) {
      let regex = new RegExp(text, "gi");
      if (regex.test(elmnt[1].content)) {
        noteFactory(elmnt[0], elmnt[1]);
      }
    }
  }

  undoAction(command) {
    try {
      let action = command.action;
      let id = command.id;
      let entries = localStorage.getItem("entries");
      entries = JSON.parse(entries);

      // Handle the creation event:
      if (action === "noteCreation") {
        let noteToDelete = document.getElementById(id);
        document.body.removeChild(noteToDelete);
        delete entries[id];
        localStorage.setItem("entries", JSON.stringify(entries));
      }
      // Handle the modification:
      else if (action === "noteModification" || action === "noteMovement") {
        // 1) The code modifies the local storage, with the
        //    values provided in the command.
        entries[id] = command.entry;
        localStorage.setItem("entries", JSON.stringify(entries));
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
        entries[id] = command.entry;
        localStorage.setItem("entries", JSON.stringify(entries));
        noteFactory(id, command.entry);
      }
    } catch (TypeError) {}
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

      // The dates:
      let creationDate = new Date();
      creationDate = String(creationDate).substring(0, 24);
      let modificationDate = creationDate;

      // ----------Start: JSON format----------
      // Creation of the entry in the localStorage
      let entryJSON = {
        positionX: left,
        positionY: top,
        creationDate: creationDate,
        modificationDate: modificationDate,
        content: "",
      };
      // There are 2 options:
      // 1) This is the first note created:
      if (!localStorage.getItem("entries")) {
        // The code creates the -entries- entry in the localStorage
        let entries = {};
        entries[index] = entryJSON;
        localStorage.setItem("entries", JSON.stringify(entries));
      }
      // 2) There are previously created notes:
      else {
        // The code uses the -entries- stored in the localStorage
        // to retrive the information contained there:
        let retrieveEntries = localStorage.getItem("entries");
        let entries = JSON.parse(retrieveEntries);
        // The code updates the -entries- entry in the localStorage:
        entries[index] = entryJSON;
        localStorage.setItem("entries", JSON.stringify(entries));
      }
      // ---------- End: JSON format ----------
      // Now the code creates the note
      noteFactory(index, entryJSON);
    }
    // Handle the deletion:
    else if (action === "noteDeletion") {
      // Remove the note from the DOM:
      let noteToDelete = document.getElementById(command.id);
      document.body.removeChild(noteToDelete);

      // Remove the note from the local storage
      let retrieveEntries = localStorage.getItem("entries");
      let entries = JSON.parse(retrieveEntries);
      delete entries[command.id];
      localStorage.setItem("entries", JSON.stringify(entries));
    }
    // Handle the modification:
    else if (action === "noteModification") {
      let modificationDate = new Date();
      modificationDate = String(modificationDate).substring(0, 24);

      // ----------Start: JSON format----------
      // The code uses the -entries- stored in the localStorage
      // to retrive the information contained there:
      let retrieveEntries = localStorage.getItem("entries");
      let entries = JSON.parse(retrieveEntries);
      // // The code updates the -entries- entry in the localStorage:
      entries[command.id].modificationDate = modificationDate;
      entries[command.id].content = command.entry.content;
      localStorage.setItem("entries", JSON.stringify(entries));
      // // ---------- End: JSON format ----------
    }
    // Handle the movement:
    else if (action === "noteMovement") {
      // The code has to update the entries (to reflect the move)
      // 1) Extract the entries from the local Storage:
      let entries = localStorage.getItem("entries");
      // 2) Parse the information:
      entries = JSON.parse(entries);
      // 3) Update the information:
      entries[command.id] = command.entry;
      // 4) Saves the updated entries in the local storage
      localStorage.setItem("entries", JSON.stringify(entries));
    }

    // Handle the page refresh:
    else if (action === "pageRefresh") {
      let entries = localStorage.getItem("entries");
      entries = JSON.parse(entries);
      for (let elmnt of Object.entries(entries)) {
        noteFactory(elmnt[0], elmnt[1]);
      }
    }
  }
  // -----------END: INPUT HANDLER-----------
}

let modelObject = new Model();

export default modelObject;
