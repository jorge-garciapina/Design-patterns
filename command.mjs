import noteSubject from "./observer.mjs";
class NoteCommand {
  constructor(subject) {
    this.history = [];
  }

  undoCommand() {
    let command = this.history[this.history.length - 1];

    noteSubject.undoAction(command);

    let deleted = this.history.pop();
  }

  creationCommand(id) {
    let command = {
      action: "noteCreation",
      id: id,
    };
    this.history.push(command);

    noteSubject.commandHandler(command);
  }

  deletionCommand(id, entry) {
    let command = {
      action: "noteDeletion",
      id: id,
      entry: entry,
    };
    this.history.push(command);
    console.log(command);

    noteSubject.commandHandler(command);
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

    noteSubject.commandHandler(newCommand);
  }

  reloadCommand() {
    let command = {
      action: "pageRefresh",
      id: "",
      text: "",
    };
    this.history.push(command);

    noteSubject.commandHandler(command);
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

    noteSubject.commandHandler(newCommand);
  }

  searchCommand(array) {
    // The searches will not generate history
    noteSubject.searchHandler(array);
  }
}

let noteCommand = new NoteCommand();
noteSubject.addObserver(noteCommand);

export default noteCommand;
