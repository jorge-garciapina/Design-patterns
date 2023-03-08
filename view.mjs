// THIS MODULES MANAGES THE INPUTS THAT ARE DIRECTLY
// RELATED WITH THE HTML
// I CONSIDER THIS THE VIEW LAYER 1
import noteCommand from "./command.mjs";
import modelObject from "./model.mjs";
import manageInputInSearchArea from "./presenter.js";

// --------------- START: SESSION---------------
window.addEventListener("load", function () {
  const visited = modelObject.modelGetItem("0");
  if (!!visited) {
    // When the user refresh the page
    noteCommand.reloadCommand();
  } else {
    // When the user opens the page for the first time
    modelObject.indexInitialization();
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
  let id = modelObject.generateID();
  noteCommand.creationCommand(id);
};
// --------------END: New note button----------------

let searchArea = document.getElementById("search-area");
// Character counter:
let characterCounter = document.getElementById("character-counter");

manageInputInSearchArea(searchArea, characterCounter, 50);
// --------------END: SEARCHING AREA----------------
