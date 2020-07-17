import React from "react";
import { makeStyles } from "@material-ui/styles";
import { IconButton, Box, InputBase, Checkbox } from "@material-ui/core";
import ReorderIcon from "@material-ui/icons/Reorder";
import CloseIcon from "@material-ui/icons/Close";
import { Flipped } from "react-flip-toolkit";
// import { useDebouncedCallback } from "use-debounce";

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

const ItemRenderer = React.memo(props => {
  const {
    id,
    depth,
    data: { name, autoFocus, checkbox },
    onChangeName,
    onChangeCheckbox,
    onDelete,
    onReturn
  } = props;

  const [hasFocus, setFocus] = React.useState(false);
  // const [handleChangeName] = useDebouncedCallback(onChangeName, 5);
  const handleCheckbox = e => {
    console.log(e.target.value);
    onChangeCheckbox(id, e);
  };

  const handleChange = e => {
    console.log(e.target.value);
    if (e.target.value.startsWith("[]")) {
      onChangeName(id, e.target.value.substr(2));
      onChangeCheckbox(id, {checked: false})
      return true
    } 
    if (e.target.value.startsWith("[x]")) {
      onChangeName(id, e.target.value.substr(3));
      onChangeCheckbox(id, {checked: true})
      return true
    }
    onChangeName(id, e.target.value); 
  };

  const handleClickDelete = () => {
    onDelete(id);
  };

  const handleKeyDown = e => {
    console.log(`keyCode:${e.keyCode} key:${e.key}`);
    if (e.key === "Enter") {
      onReturn(id);
    }

    if (e.keyCode === 8 && name === "") {
      onDelete(id);
    }

    if (e.keyCode === 46) {
      onDelete(id);
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

  const inputRef = React.useRef(null);

  React.useEffect(() => {
    if (autoFocus && !hasFocus) {
      inputRef.current.focus();
      setFocus(true);
    }
  }, [autoFocus, hasFocus]);

const showCheckbox = typeof checkbox === "object"

  return (
    <Flipped flipId={id}>
      <div ref={ref => drop(preview(ref))} className={classes.root}>
        <div style={{ marginLeft: `${depth * 10}px` }} className={classes.body}>
          <IconButton ref={drag}>
            <ReorderIcon />
          </IconButton>
          <Box display="flex" flex={1} px={1}>
            {showCheckbox && <Checkbox onChange={handleCheckbox} checked={checkbox.checked} />}
            <InputBase
              ref={inputRef}
              fullWidth
              value={name}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              autoFocus={autoFocus}
            />
          </Box>
          <IconButton onClick={handleClickDelete}>
            <CloseIcon />
          </IconButton>
        </div>
      </div>
    </Flipped>
  );
});
export default ItemRenderer;
