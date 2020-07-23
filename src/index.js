import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

const items = [
  { id: 1, name: "Some Awesome Notes here", depth: 0 },
  { id: 2, name: "i love these notes", depth: 0 }
];

const rootElement = document.getElementById("root");
ReactDOM.render(<App defaultItems={items} />, rootElement);
