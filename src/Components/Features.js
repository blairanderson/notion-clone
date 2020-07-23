import React from "react";

const FEATURES = [
  "Drag and Drop Items",
  "Nested Items",
  "Rows are infinitely DEEP",
  "'Enter' Key creates a new row",
  "'Backspace' key at beginning of Row should remove the row if empty",
  "'TAB' increase the depth of a row and children",
  "'SHIFT-TAB' decreases the depth of a row and children",
  "typing `[]` or `[x]` should convert the text row into a checkbox row",
  "'Backspace' key at beginning of checkbox row converts back to a text row"
];

const TODO = [
  "All Changes should be dastabase-backed to an API server thing",
  "'Backspace' key at beginning of Row should merge current and previous rows",
  "'Enter' key will move text after cursor to new row, if cursor in middle of row.",
  "Should be able to drag/drop photos onto the page, and create new image-rows",
  "Convert Features/TODOs into TESTS",
  "Create simpler API",
  "DogFood the simpler API"
];

export default function Features(props) {
  return (
    <>
      <label>Features:</label>
      <ul>
        {FEATURES.map(function(e) {
          return (
            <li key={btoa(e)}>
              <input type="checkbox" readOnly checked={true} />
              {e}
            </li>
          );
        })}
      </ul>
      <label>TODOs:</label>
      <ul>
        {TODO.map(function(e) {
          return (
            <li key={btoa(e)}>
              <input type="checkbox" readOnly checked={false} />
              {e}
            </li>
          );
        })}
      </ul>
    </>
  );
}
