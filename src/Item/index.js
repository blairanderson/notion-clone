import React from "react";
import log from "../log";
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
    onMergeUp,
    onCheckboxChange,
    onDelete,
    onReturn
  } = props;
  const showCheckbox = typeof checkbox === "object";
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

    onTextChange(id, e.target.value);
  }

  const TAB_KEY = 9;
  const BACKSPACE = 8;
  const DELETE_KEY = 46;

  const handleKeyDown = e => {
    log(`keyCode:${e.keyCode} key:${e.key}`);
    const { selectionStart, selectionEnd } = e.target;
    const cursorStart = selectionStart === 0 && selectionEnd === 0;

    if (e.shiftKey && e.keyCode === TAB_KEY) {
      e.preventDefault();
      const newDepth = depth - 1;
      if (newDepth > -1) {
        return changeDepth(id, newDepth);
      }
    }

    if (!e.shiftKey && e.keyCode === TAB_KEY) {
      e.preventDefault();
      const newDepth = depth + 1;
      if (newDepth > -1) {
        return changeDepth(id, newDepth);
      }
    }

    if (e.key === "Enter") {
      log({ selectionStart, selectionEnd, length: e.target.value.length });
      e.preventDefault();
      return onReturn({ id, selectionStart, selectionEnd });
    }

    // backspacing a checkbox while at front cursor position removes the checkbox
    if (cursorStart && showCheckbox && e.keyCode === BACKSPACE) {
      e.preventDefault();
      return onCheckboxChange(id, text, undefined);
    }

    // if the text is empty and delete, remove the whole row
    if (text === "" && (e.keyCode === DELETE_KEY || e.keyCode === BACKSPACE)) {
      e.preventDefault();
      return onDelete(id);
    }

    if (cursorStart && depth > 0 && e.keyCode === BACKSPACE) {
      e.preventDefault();
      return onMergeUp(id);
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
