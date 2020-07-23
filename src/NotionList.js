import React from "react";
import HTML5Backend from "react-dnd-html5-backend";
import faker from "faker/locale/en";
import { Box, Button } from "@material-ui/core";
import { Flipper } from "react-flip-toolkit";
import update from "immutability-helper";
import { DndProvider } from "react-dnd";
import Sortly, {
  ContextProvider,
  add,
  remove,
  insert,
  updateDepth
} from "react-sortly";

import Item from "./Item";

function NotionList({ defaultItems, maxDepth }) {
  const [items, setItems] = React.useState(defaultItems);
  const flipKey = items.map(({ id }) => id).join(".");

  const handleChange = newItems => {
    setItems(newItems);
  };

  const handleTextChange = (id, text) => {
    const index = items.findIndex(item => item.id === id);
    setItems(
      update(items, {
        [index]: { text: { $set: text } }
      })
    );
  };

  const handleCheckboxChange = (id, text, action) => {
    const index = items.findIndex(item => item.id === id);

    if (action === "toggle") {
      return setItems(
        update(items, {
          [index]: { checkbox: { $toggle: ["checked"] } }
        })
      );
    }

    setItems(
      update(items, {
        [index]: { text: { $set: text }, $merge: { checkbox: action } }
      })
    );
  };

  const handleDelete = id => {
    const index = items.findIndex(item => item.id === id);
    if (index > 0) {
      items[index - 1].autoFocus = true;
    }
    setItems(remove(items, index));
  };

  function handleClickAdd() {
    setItems(
      add(items, {
        id: Date.now(),
        text: faker.name.findName(),
        autoFocus: true
      })
    );
  }

  function changeDepth(id, newDepth) {
    const index = items.findIndex(item => item.id === id);
    setItems(updateDepth(items, index, newDepth, maxDepth || 10));
  }

  const handleReturn = id => {
    const index = items.findIndex(item => item.id === id);
    setItems(
      insert(
        items.map(item => Object.assign(item, { autoFocus: false })),
        {
          id: Date.now(),
          text: "",
          autoFocus: true
        },
        index
      )
    );
  };

  return (
    <div>
      <Flipper flipKey={flipKey}>
        <Sortly items={items} onChange={handleChange}>
          {props => (
            <Item
              {...props}
              onTextChange={handleTextChange}
              changeDepth={changeDepth}
              onCheckboxChange={handleCheckboxChange}
              onDelete={handleDelete}
              onReturn={handleReturn}
            />
          )}
        </Sortly>
      </Flipper>
      <Box mt={4}>
        <Button variant="outlined" onClick={handleClickAdd}>
          Add New Item
        </Button>
      </Box>
      <hr />
      <textarea
        readOnly={true}
        rows={80}
        cols={80}
        value={JSON.stringify(items, null, 4)}
      />
    </div>
  );
}

const AppContainer = props => (
  <DndProvider backend={HTML5Backend}>
    <ContextProvider>
      <NotionList {...props} />
    </ContextProvider>
  </DndProvider>
);

export default AppContainer;
