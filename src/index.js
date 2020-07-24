import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

const items = [
  { id: 1, text: "Some Awesome Notes here", depth: 0 },
  { id: 2, text: "i love these notes", depth: 1, checkbox: { checked: false } },
  { id: 3, text: "i love these notes", depth: 0, checkbox: { checked: true } }
];

const TOP_LEVEL_NUMBERS = "top";
const ALL_LEVEL_NUMBERS = "all";
const NO_NUMBERS = undefined;

const LIST_TYPES = {
  "No Numbers": NO_NUMBERS,
  "Numbers on All Elements": ALL_LEVEL_NUMBERS,
  "Top Level Numbers": TOP_LEVEL_NUMBERS
};

ReactDOM.render(
  <App
    maxDepth={1}
    listType={LIST_TYPES["Top Level Numbers"]}
    defaultItems={items}
  />,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
