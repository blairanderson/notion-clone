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
      <h1 style={{ marginBottom: 0, fontFamily: "sans-serif" }}>
        <a style={{ color: "black" }} href={headerLink}>
          React Notion Clone
        </a>
      </h1>
      <div style={{ marginBottom: "10px" }}>
        <a href={GITHUB}>Github</a> / <a href={CODESANDBOX}>Codesandbox</a>
      </div>
    </>
  );
}
