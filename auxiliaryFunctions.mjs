// This is an auxiliar module. It creates a function which
// is used to read the information contain in the entries
// of the localStorage in the format we decided.

// Function used to add the position in the format
// used in this app (with 5 digits)
export function zeroAdder(element) {
  element = String(element);
  if (element.length === 1) {
    return "0000" + element;
  } else if (element.length === 2) {
    return "000" + element;
  } else if (element.length === 3) {
    return "00" + element;
  } else if (element.length === 4) {
    return "0" + element;
  } else {
    return element;
  }
}

export function zeroRemover(element) {
  if (element === "0") {
    return element;
  }
  while (true) {
    if (element[0] === "0") {
      element = element.substring(1, element.length);
    } else {
      return element;
    }
  }
}

function entryReader(entry) {
  return {
    coordinates: [entry.substring(0, 5), entry.substring(5, 10)],
    creationDate: entry.substring(10, 34),
    modificationDate: entry.substring(34, 58),
    text: entry.substring(58, entry.length),
  };
}

export default entryReader;
