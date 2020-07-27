import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

const TOP_LEVEL_NUMBERS = "top";
const ALL_LEVEL_NUMBERS = "all";
const NO_NUMBERS = undefined;

const LIST_TYPES = {
  "No Numbers": NO_NUMBERS,
  "Numbers on All Elements": ALL_LEVEL_NUMBERS,
  "Top Level Numbers": TOP_LEVEL_NUMBERS
};

console.log(`apiGet: ${window.REACT_APP_API_GET}`);
console.log(`apiPost:${window.REACT_APP_API_POST}`);

const OPTIONS = {
  maxDepth: 1,
  listType: LIST_TYPES["Top Level Numbers"],
  defaultItems: window.ActiveListItems,
  apiGet: window.REACT_APP_API_GET,
  apiPost: window.REACT_APP_API_POST
};

ReactDOM.render(<App {...OPTIONS} />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
