import modelObject from "./model.mjs";
class NoteCommand {
  constructor(subject) {
    this.history = [];
  }
  undoCommand() {
    let command = this.history[this.history.length - 1];

    modelObject.undoAction(command);

    let deleted = this.history.pop();
  }

  creationCommand(id) {
    let command = {
      action: "noteCreation",
      id: id,
    };
    this.history.push(command);

    modelObject.commandHandler(command);
  }

  deletionCommand(id, entry) {
    let command = {
      action: "noteDeletion",
      id: id,
      entry: entry,
    };
    this.history.push(command);

    modelObject.commandHandler(command);
  }

  modificationCommand(id, newEntry, oldEntry) {
    let newCommand = {
      action: "noteModification",
      id: id,
      entry: newEntry,
    };
    let oldCommand = {
      action: "noteModification",
      id: id,
      entry: oldEntry,
    };

    this.history.push(oldCommand);

    modelObject.commandHandler(newCommand);
  }

  reloadCommand() {
    let command = {
      action: "pageRefresh",
      id: "",
      text: "",
    };
    this.history.push(command);

    modelObject.commandHandler(command);
  }

  movementCommand(id, newEntry, oldEntry) {
    let newCommand = {
      action: "noteMovement",
      id: id,
      entry: newEntry,
    };
    let oldCommand = {
      action: "noteMovement",
      id: id,
      entry: oldEntry,
    };

    this.history.push(oldCommand);

    modelObject.commandHandler(newCommand);
  }

  searchCommand(text) {
    // The searches will not generate history
    modelObject.searchHandler(text);
  }
}

let noteCommand = new NoteCommand();
// modelObject.addObserver(noteCommand);

export default noteCommand;

