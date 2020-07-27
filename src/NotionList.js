import React from "react";
import HTML5Backend from "react-dnd-html5-backend";
import faker from "faker/locale/en";
import { Box, Button } from "@material-ui/core";
import axios from "axios";
import { Flipper } from "react-flip-toolkit";
import update from "immutability-helper";
import { DndProvider } from "react-dnd";
import Item from "./Item";
import Sortly, {
  ContextProvider,
  add,
  remove,
  insert,
  updateDepth
} from "react-sortly";

const debounce = (fn, delay) => {
  let timer = null;
  return function(...args) {
    const context = this;
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(context, args);
    }, delay);
  };
};

function NotionList({ defaultItems, listType, maxDepth, apiGet, apiPost }) {
  let FIRST_LOAD = 0;
  const [items, setItems] = React.useState(defaultItems);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (FIRST_LOAD === 0 && typeof apiGet === "string") {
      setLoading(true);
      axios
        .get(apiGet)
        .then(({ config, data, headers }) => {
          FIRST_LOAD++;
          console.log(data);
          setItems(data);
          setLoading(false);
        })
        .catch(e => {
          setLoading(false);
          console.error(`Could Not fetch ${apiGet}...`);
        });
    }
  }, [FIRST_LOAD, apiGet]);

  const debounceOnChangeSlow = React.useCallback(
    debounce(onChangeAsync, 2500),
    []
  );

  function onChangeAsync(items) {
    setLoading(true);
    axios
      .post(apiPost, { items })
      .then(({ config, data, headers }) => {
        setItems(data);
        setLoading(false);
      })
      .catch(e => {
        setLoading(false);
        console.error(`Could Not fetch ${apiGet}...`);
      });
  }

  const handleChange = newItems => {
    setItems(newItems);
    if (typeof apiPost === "string") {
      debounceOnChangeSlow(newItems);
    }
  };
  const handleChangeNow = newItems => {
    setItems(newItems);
    if (typeof apiPost === "string") {
      onChangeAsync(newItems);
    }
  };

  const handleTextChange = (id, text) => {
    const index = items.findIndex(item => item.id === id);
    handleChange(
      update(items, {
        [index]: { text: { $set: text } }
      })
    );
  };

  const handleCheckboxChange = (id, text, action) => {
    const index = items.findIndex(item => item.id === id);

    if (action === "toggle") {
      return handleChange(
        update(items, {
          [index]: { checkbox: { $toggle: ["checked"] } }
        })
      );
    }

    handleChange(
      update(items, {
        [index]: { text: { $set: text }, $merge: { checkbox: action } }
      })
    );
  };

  const handleDelete = id => {
    const index = items.findIndex(item => item.id === id);
    let msg = `Are you sure you want to delete "${items[index].text}"?`;

    console.log("items[index].depth:" + items[index].depth);
    if (items[index].depth === 0) {
      const nextParentIndex = items.findIndex(function(el, el_index) {
        return el.depth === 0 && el_index > index;
      });
      console.log(JSON.stringify({ nextParentIndex }));
      // count the number of children
      // number of items with higher index until the next depth 0
      const childrenToDelete = items.filter(function(el, el_index) {
        return nextParentIndex > -1
          ? el_index > index && el_index < nextParentIndex
          : el_index > index;
      });

      console.log(JSON.stringify({ childrenToDelete }));

      if (childrenToDelete.length > 0) {
        msg =
          msg + `\n\nThis will also delete ${childrenToDelete.length} todos...`;
      }
    }

    if (window.confirm(msg)) {
      if (index > 0) {
        // update autoFocus when an item is removed
        handleChangeNow(
          remove(
            update(items, {
              [index - 1]: { autoFocus: { $set: true } }
            }),
            index
          )
        );
      } else {
        handleChangeNow(remove(items, index));
      }
    }
  };

  function handleClickAdd() {
    handleChange(
      add(items, {
        id: Date.now(),
        text: faker.name.findName(),
        autoFocus: true
      })
    );
  }

  function changeDepth(id, newDepth) {
    const index = items.findIndex(item => item.id === id);
    handleChange(updateDepth(items, index, newDepth, maxDepth));
  }

  // creates a new blank row
  const handleReturn = id => {
    const index = items.findIndex(item => item.id === id);
    handleChange(
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

  // include optional line numbers onto the front of each list element
  const depthIndex = {};
  const numberedItems = items.map(function addLineNumbers(rowWithNumbers) {
    const { number, ...row } = rowWithNumbers;
    let newObject = row;

    depthIndex[row.depth] = depthIndex[row.depth] || 1; // start indexing at 1.

    if (listType === "top" && row.depth === 0) {
      newObject = Object.assign({ number: depthIndex[row.depth] }, row);
      depthIndex[row.depth]++;
    }

    if (listType === "all") {
      newObject = Object.assign({ number: depthIndex[row.depth] }, row);
      depthIndex[row.depth]++;
      depthIndex[row.depth + 1] = 1;
    }

    return newObject;
  });

  // slightly GREY the dashboard and prevent any clicks
  const preventEditsWhileLoading = e => {
    if (loading) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const containerStyle = {};
  if (loading) {
    containerStyle["pointerEvents"] = "none";
    containerStyle["opacity"] = 0.65;
  }

  return (
    <div
      onClick={preventEditsWhileLoading}
      onMouseDown={preventEditsWhileLoading}
      style={containerStyle}
    >
      <div>&nbsp;{loading && <>Syncing...</>}</div>
      <Flipper flipKey={items.map(i => i.id).join(".")}>
        <Sortly
          items={numberedItems}
          maxDepth={maxDepth}
          onChange={handleChange}
        >
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
