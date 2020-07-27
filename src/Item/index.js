import React from "react";
import { makeStyles } from "@material-ui/styles";
import { IconButton, Box, Checkbox } from "@material-ui/core";
import ReorderIcon from "@material-ui/icons/Reorder";
import CloseIcon from "@material-ui/icons/Close";
import { Flipped } from "react-flip-toolkit";
import TextRow from "./TextRow";
import { useDrag, useDrop, useIsClosestDragging } from "react-sortly";

const useStyles = makeStyles(theme => ({
  root: props => ({
    position: "relative",
    marginBottom: "1px",
    zIndex: props.muted ? 1 : 0
  }),

  body: props => ({
    display: "flex",
    background: "#fff",
    cursor: "move",
    boxShadow: props.muted ? "0px 0px 8px #666" : "0px 0px 2px #666",
    border: props.muted ? "1px dashed #1976d2" : "1px solid transparent"
  })
}));

const Item = React.memo(props => {
  const {
    id,
    depth,
    data: { number, text, autoFocus, checkbox },
    onTextChange,
    changeDepth,
    onCheckboxChange,
    onDelete,
    onReturn
  } = props;
  const inputRef = React.useRef(null);
  // const [hasFocus, setFocus] = React.useState(false);
  // const [handleTextChange] = useDebouncedCallback(onTextChange, 5);
  const handleCheckbox = e => {
    log(e.target.value);
    onCheckboxChange(id, text, "toggle");
  };

  function handleChange(e) {
    if (e.target.value.startsWith("[]")) {
      const newText = e.target.value.toString().substring(2);
      return onCheckboxChange(id, newText, {
        checked: false
      });
    }

    if (e.target.value.startsWith("[x]")) {
      const newText = e.target.value.toString().substring(3);
      return onCheckboxChange(id, newText, {
        checked: true
      });
    }

    // console.log("onTextChange:" + e.target.value);
    onTextChange(id, e.target.value);
  }

  const TAB_KEY = 9;
  const DELETE_KEY = 8;

  const handleKeyDown = e => {
    console.log(`keyCode:${e.keyCode} key:${e.key}`);
    const { selectionStart, selectionEnd } = inputRef.current;
    log({ selectionStart, selectionEnd });

    if (e.shiftKey && e.keyCode === TAB_KEY) {
      e.preventDefault();
      const newDepth = depth - 1;
      if (newDepth > -1) {
        changeDepth(id, newDepth);
      }
    }

    if (!e.shiftKey && e.keyCode === TAB_KEY) {
      e.preventDefault();
      const newDepth = depth + 1;
      if (newDepth > -1) {
        changeDepth(id, newDepth);
      }
    }

    if (e.key === "Enter") {
      e.preventDefault();
      onReturn(id);
    }

    if (
      e.keyCode === DELETE_KEY &&
      inputRef.selectionStart === "" &&
      typeof checkbox === "object"
    ) {
      // delete/backspacing a checkbox removes the checkbox
      return onCheckboxChange(id, text, undefined);
    }

    if ((e.keyCode === DELETE_KEY && text === "") || e.keyCode === 46) {
      e.preventDefault();
      onDelete(id);
    }

    const cursorPosition = 12345;

    if (e.keyCode === DELETE_KEY && text.length > 0 && cursorPosition === 0) {
      // deleting should merge the CURRENT and PREVIOUS rows
    }
  };

  const [{ isDragging }, drag, preview] = useDrag({
    collect: monitor => ({ isDragging: monitor.isDragging() })
  });

  const [, drop] = useDrop();
  const classes = useStyles({
    muted: useIsClosestDragging() || isDragging,
    depth
  });

  React.useEffect(() => {
    if (autoFocus) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const showCheckbox = typeof checkbox === "object";
  const iconSize = 15;
  const margin = depth === 0 ? "dense" : "none";
  let inputProps = { style: { fontWeight: 100 } };
  if (depth === 0) {
    inputProps = Object.assign(inputProps, { style: { fontWeight: 600 } });
  }
  if (showCheckbox && checkbox.checked) {
    inputProps = Object.assign(inputProps, {
      style: { textDecoration: "line-through" }
    });
  }

  return (
    <Flipped flipId={id}>
      <div ref={ref => drop(preview(ref))} className={classes.root}>
        <div style={{ marginLeft: `${depth * 40}px` }} className={classes.body}>
          <IconButton ref={drag}>
            {typeof number === "number" && number > 0 && `${number}. `}
            <ReorderIcon style={{ fontSize: iconSize }} />
          </IconButton>
          <Box display="flex" flex={1} px={1}>
            {showCheckbox && (
              <Checkbox onChange={handleCheckbox} checked={checkbox.checked} />
            )}
            <TextRow
              {...{
                inputProps,
                margin,
                inputRef,
                text,
                handleChange,
                handleKeyDown,
                autoFocus
              }}
            />
          </Box>
          <IconButton
            onClick={() => {
              onDelete(id);
            }}
          >
            <CloseIcon style={{ fontSize: iconSize }} />
          </IconButton>
        </div>
      </div>
    </Flipped>
  );
});
export default Item;

function log(p) {
  console.log(JSON.stringify(p));
}
