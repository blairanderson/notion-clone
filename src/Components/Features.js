import React from "react";

const FEATURES = [
  "Drag and Drop Items",
  "Nested Items have configuratable `maxDepth`",
  "'Enter' Key creates a new row",
  "'Enter' Key moves text after cursor to new row, if cursor in middle of row.",
  "'Backspace' key at beginning of Row should remove the row if empty",
  "'TAB' increase the depth of a row and children",
  "'SHIFT-TAB' decreases the depth of a row and children",
  "typing `[]` or `[x]` should convert the text row into a checkbox row",
  "All Changes can be persisted to an endpoint/API/server-thing",
  "'Backspace' key at beginning of checkbox row converts back to a text row",
  "'Backspace' key at beginning of Row should merge current and previous rows",
  "Optional: PREFIX-Numbers are null/top/all",
  "Optional: maxDepth to prevent infinitely deep nesting"
];

const TODO = [
  "extract table functionality to NPM package",
  "uploading photos onto each row",
  "Should be able to drag/drop photos onto the page"
];

export default function Features(props) {
  return (
    <>
      <p>
        <strong>Why Did I Build This?</strong>
        <br />
        Apps like Notion and Airtable set a new standard interface expectation
        for user input. I have a private work application with rudimentary
        "todos" and just cringed every time that I had to submit a form to
        "re-order" tasks.
        <br />
        This application is a starting point for flexibility.
      </p>
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
