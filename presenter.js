import noteCommand from "./command.mjs";
import modelObject from "./model.mjs";

function sanitizeInput(input) {
  const allowedCharacters = /^[a-zA-Z0-9\s!"#$%&/()=?¡+\\*\/-]*$/;
  return input
    .split("")
    .filter((char) => allowedCharacters.test(char))
    .join("");
}

function manageInputInSearchArea(
  searchArea,
  characterCounter,
  maxNumberOfCharacters
) {
  searchArea.maxLength = maxNumberOfCharacters;

  // Character counter:
  searchArea.addEventListener("input", () => {
    searchArea.value = sanitizeInput(searchArea.value);
    let numberOfCharacters = searchArea.value.length;

    sendSearchCommand(searchArea.value);

    characterCounter.textContent =
      String(maxNumberOfCharacters - numberOfCharacters) +
      "/" +
      maxNumberOfCharacters;
  });

  searchArea.addEventListener("keydown", function (event) {
    if (event.key === "Tab") {
      if (searchArea.value.replace(/\t/g, " ").length < maxNumberOfCharacters) {
        event.preventDefault();

        let positionOfTabEventInText = searchArea.selectionStart;
        let textInSearchArea = searchArea.value;

        let textBeforeTab = textInSearchArea.substring(
          0,
          positionOfTabEventInText
        );
        let textAfterTab = textInSearchArea.substring(
          positionOfTabEventInText,
          textInSearchArea.length
        );

        let textWithTabInserted = textBeforeTab + "\t" + textAfterTab;
        sendSearchCommand(textWithTabInserted);

        searchArea.value = textWithTabInserted;
        // // Commands to make the text selection
        // // to behave correctly:
        searchArea.selectionStart = positionOfTabEventInText + 1;
        searchArea.selectionEnd = positionOfTabEventInText + 1;

        let numberOfCharacters = searchArea.value.replace(/\t/g, " ").length;
        characterCounter.textContent =
          String(maxNumberOfCharacters - numberOfCharacters) +
          "/" +
          maxNumberOfCharacters;
      } else {
        event.preventDefault();
      }
    }
  });
}

export function manageCharacterCounterInNote(areaToSearch, counterElement) {
  // Remove any disallowed characters from the input
  const allowedCharacters = /^[a-zA-Z0-9\s!"#$%&/()=?¡+\\*\/-]*$/;
  const sanitizedValue = areaToSearch.value
    .split("")
    .filter((char) => allowedCharacters.test(char))
    .join("");

  areaToSearch.value = sanitizedValue.replace(/\t/g, " ");
  let numberOfCharacters = sanitizedValue.length;

  if (numberOfCharacters > 90) {
    areaToSearch.value = areaToSearch.value.slice(0, 90);
    numberOfCharacters = 90;
  }

  counterElement.textContent = String(90 - numberOfCharacters) + "/90";
}

export function manageTabInNote(textArea, characterCounter, event) {
  if (event.key === "Tab") {
    if (textArea.value.replace(/\t/g, " ").length < 90) {
      event.preventDefault();

      let positionOfTabEventInText = textArea.selectionStart;
      let textInSearchArea = textArea.value;

      let textBeforeTab = textInSearchArea.substring(
        0,
        positionOfTabEventInText
      );
      let textAfterTab = textInSearchArea.substring(
        positionOfTabEventInText,
        textInSearchArea.length
      );

      // Insertion of the tab character:
      let textWithTabInserted = textBeforeTab + "\t" + textAfterTab;

      textArea.value = textWithTabInserted;
      // // Commands to make the text selection
      // // to behave correctly:
      textArea.selectionStart = positionOfTabEventInText + 1;
      textArea.selectionEnd = positionOfTabEventInText + 1;

      let numberOfCharacters = textArea.value.replace(/\t/g, " ").length;
      characterCounter.textContent = String(90 - numberOfCharacters) + "/" + 90;
    } else {
      event.preventDefault();
    }
  }
}

//-------------------------------------------
//-------------------------------------------

export function sendDeletionCommand(id) {
  // COMMAND:
  let entry = modelObject.getItemJSON(id);
  noteCommand.deletionCommand(id, entry);
}
export function sendMovementCommand(id, leftPosition, topPosition) {
  // COMMAND:
  let oldEntry = modelObject.getItemJSON(id);
  let newEntry = modelObject.getItemJSON(id);
  newEntry.positionX = parseInt(leftPosition);
  newEntry.positionY = parseInt(topPosition);
  noteCommand.movementCommand(id, newEntry, oldEntry);
}

export function sendSearchCommand(textToSearch) {
  noteCommand.searchCommand(textToSearch);
}
export function sendModificationCommand(textArea, id) {
  // ----------Start: JSON format----------
  let oldEntryJSON = modelObject.getItemJSON(id);
  let newEntryJSON = oldEntryJSON;
  newEntryJSON.content = textArea.value;
  // ---------- End: JSON format ----------

  // COMMAND:
  noteCommand.modificationCommand(id, newEntryJSON, oldEntryJSON);
}

export default manageInputInSearchArea;
