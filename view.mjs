// THIS MODULES MANAGES THE INPUTS THAT ARE DIRECTLY
// RELATED WITH THE HTML
// I CONSIDER THIS THE VIEW LAYER 1
import noteCommand from "./command.mjs";

// --------------- START: SESSION---------------
window.addEventListener("load", function () {
  const visited = localStorage.getItem("0");
  if (!!visited) {
    // When the user refresh the page
    noteCommand.reloadCommand();
  } else {
    // When the user opens the page for the first time
    localStorage.setItem("i", "1");
    // localStorage.setItem("0", "visited");
  }
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
  let id = localStorage.getItem("i");
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
// --------------END: SEARCHING AREA----------------
