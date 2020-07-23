import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

const items = [
  { id: 1, text: "Some Awesome Notes here", depth: 0 },
  { id: 2, text: "i love these notes", depth: 0 }
];

const rootElement = document.getElementById("root");
ReactDOM.render(<App defaultItems={items} />, rootElement);
