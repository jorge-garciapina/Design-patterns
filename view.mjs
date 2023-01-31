// THIS MODULES MANAGES THE INPUTS THAT ARE DIRECTLY
// RELATED WITH THE HTML
// I CONSIDER THIS THE VIEW LAYER 1
import noteCommand from "./command.mjs";
import noteSubject from "./observer.mjs";


// --------------- START: SESSION---------------
window.addEventListener("load", function () {
  noteSubject.indexInitialization();
});
//---------------- END: SESSION----------------

// -------------START: Undo button---------------
let undo = document.getElementById("undo");
undo.onclick = function () {
  noteCommand.undoCommand();
};
// --------------END: Undo button----------------

// -------------START: New note button---------------
let noteCreation = document.getElementById("new-note");
noteCreation.onclick = function () {
  let id = noteSubject.generateID();
  noteCommand.creationCommand(id);
};
// --------------END: New note button----------------

// -------------START: SEARCHING AREA---------------
let searchArea = document.getElementById("search-area");
searchArea.maxLength = 50;

// Character counter:
searchArea.addEventListener("input", () => {
  let wordsToSearch = searchArea.value.split(" ");
  wordsToSearch = wordsToSearch.filter((elmnt) => elmnt !== "");

  noteCommand.searchCommand(wordsToSearch);
  let charNum = searchArea.value.length;
  let inputText = document.getElementById("word-counter");

  inputText.innerHTML = String(50 - charNum) + "/50";
});

//-----------  START: TAB CONFIGURATION -----------
searchArea.addEventListener("keydown", function (event) {
  if (event.key === "Tab") {
    event.preventDefault();
    // Commands to retrieve the position
    // of the text selection
    const start = searchArea.selectionStart;
    const end = searchArea.selectionEnd;

    // Commands to separate the text before
    // and after the text selection
    const inputText = searchArea.value;
    let textBefore = inputText.substring(0, start);
    let textAfter = inputText.substring(end, inputText.length);

    // Insertion of the tab character:
    searchArea.value = textBefore + "\t" + textAfter;

    // Commands to make the text selection
    // to behave correctly:
    searchArea.selectionStart = start + 1;
    searchArea.selectionEnd = start + 1;
  }
});
//-----------   END: TAB CONFIGURATION  -----------
// --------------END: SEARCHING AREA----------------
