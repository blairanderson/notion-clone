import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

const items = [
  { id: 1, text: "Some Awesome Notes here", depth: 0 },
  { id: 2, text: "i love these notes", depth: 0, checkbox: { checked: false } },
  { id: 3, text: "i love these notes", depth: 0, checkbox: { checked: true } }
];

const rootElement = document.getElementById("root");
ReactDOM.render(<App maxDepth={1} defaultItems={items} />, rootElement);
