import React from "react";

const FEATURES = [
  "Drag and Drop Items",
  "Nested Items",
  "Rows are infinitely DEEP",
  "'Enter' Key creates a new row",
  "'Delete' key at beginning of Row should remove the row if empty"
];

const TODO = [
  "'Delete' key at beginning of Row should merge current and previous rows",
  "'Enter' key will move text after cursor to new row, if cursor in middle of row.",
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
            <li>
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
            <li>
              <input type="checkbox" readOnly />
              {e}
            </li>
          );
        })}
      </ul>
    </>
  );
}
