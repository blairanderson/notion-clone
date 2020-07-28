import React from "react";

const GITHUB = "https://github.com/blairanderson/notion-clone";
const CODESANDBOX =
  "https://codesandbox.io/s/github/blairanderson/notion-clone";

const headerLink = window.location.href.startsWith("https://codesandbox")
  ? "https://codesandbox.io/s/github/blairanderson/notion-clone"
  : "https://notionclone.netlify.app/";

export default function Header(props) {
  return (
    <>
      <h1 style={{ marginBottom: 0, fontFamily: "monospace" }}>
        <a
          style={{
            fontWeight: 100,
            textDecoration: "none",
            color: "black"
          }}
          href={headerLink}
        >
          React Action Todo
        </a>
      </h1>
      <h2>Medium/Notion-Like List application</h2>
      <div style={{ marginBottom: "10px" }}>
        <a rel="noopener noreferrer" target="_blank" href={GITHUB}>
          Github
        </a>
        {" / "}
        <a rel="noopener noreferrer" target="_blank" href={CODESANDBOX}>
          Codesandbox
        </a>
      </div>
    </>
  );
}
