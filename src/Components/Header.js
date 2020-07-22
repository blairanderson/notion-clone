import React from "react";

const GITHUB = "https://github.com/blairanderson/notion-clone";
const CODESANDBOX =
  "https://codesandbox.io/s/github/blairanderson/notion-clone";

export default function Header(props) {
  return (
    <>
      <h1 style={{ marginBottom: 0, fontFamily: "sans-serif" }}>
        React Notion Clone
      </h1>
      <div style={{ marginBottom: "10px" }}>
        <a href={GITHUB}>Github</a> / <a href={CODESANDBOX}>Codesandbox</a>
      </div>
    </>
  );
}
