import React from "react";
import HTML5Backend from "react-dnd-html5-backend";
import faker from "faker/locale/en";
import { Box, Button } from "@material-ui/core";
import { Flipper } from "react-flip-toolkit";
import update from "immutability-helper";
import { DndProvider } from "react-dnd";
import Sortly, { ContextProvider, add, remove, insert } from "react-sortly";
import ItemRenderer from "./ItemRenderer";

const ITEMS = [
  { id: 1, name: "Some Awesome Notes here", depth: 0 },
  { id: 2, name: "i love these notes", depth: 0 }
];

function NotionList() {
  const [items, setItems] = React.useState(ITEMS);
  const flipKey = items.map(({ id }) => id).join(".")

  const handleChange = newItems => {
    setItems(newItems);
  };

  const handleChangeName = (id, name) => {
    const index = items.findIndex(item => item.id === id);
    setItems(
      update(items, {
        [index]: { name: { $set: name } }
      })
    );
  };

  const handleCheckboxChange = (id, action) => {
    const index = items.findIndex(item => item.id === id);
    console.log(id + "|" + JSON.stringify(action));
    if (action === "toggle") {
      setItems(
        update(items, {
          [index]: { checkbox: { $toggle: "checked" } }
        })
      );
      return true;
    }

    setItems(
      update(items, {
        [index]: { $merge: { checkbox: action } }
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
        name: faker.name.findName(),
        autoFocus: true
      })
    );
  }

  const handleReturn = id => {
    const index = items.findIndex(item => item.id === id);
    setItems(
      insert(
        items.map(item => Object.assign(item, { autoFocus: false })),
        {
          id: Date.now(),
          name: "",
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
            <ItemRenderer
              {...props}
              onChangeName={handleChangeName}
              onChangeCheckbox={handleCheckboxChange}
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

const AppContainer = () => (
  <DndProvider backend={HTML5Backend}>
    <ContextProvider>
      <NotionList />
    </ContextProvider>
  </DndProvider>
);

export default AppContainer;
