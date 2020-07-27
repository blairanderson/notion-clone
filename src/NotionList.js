import React from "react";
import log from "./log";
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
  const isFetching = false;

  // const { isFetching } = useQuery("items", async () => {
  //   const { data } = await axios.get(apiGet);
  //   setItems(data);
  //   return data;

  React.useEffect(() => {
    if (FIRST_LOAD === 0 && typeof apiGet === "string") {
      setLoading(true);
      axios.get(apiGet).then(({ config, data, headers }) => {
        FIRST_LOAD++;
        log(data);
        setItems(data);
        setLoading(false);
      });
    }
  }, [FIRST_LOAD, apiGet]);

  const debounceOnChangeSlow = React.useCallback(
    debounce(onChangeAsync, 2500),
    []
  );

  function onChangeAsync(items) {
    setLoading(true);
    axios.post(apiPost, { items }).then(({ config, data, headers }) => {
      setItems(data);
      setLoading(false);
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

  // creates a new blank row
  const onMergeUp = id => {
    // get text from the current ID and merge to the previous ID
    log("on Merge Up");
    const index = items.findIndex(item => item.id === id);
    // if the rows are on the same depth
    if (
      items[index] &&
      items[index - 1] &&
      items[index].depth === items[index - 1].depth
    ) {
      const newtext = items[index - 1].text + " " + items[index].text;

      handleChangeNow(
        remove(
          update(items, {
            [index - 1]: { text: { $set: newtext }, autoFocus: { $set: true } }
          }),
          index
        )
      );
    }

    // merges the contents of the current index to the previous index
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

  const deleteAtIndex = index => {
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
  };

  // delete row and children

  const handleDelete = id => {
    const index = items.findIndex(item => item.id === id);
    let childrenToDelete = 0;
    let msg = `Are you sure you want to delete "${items[index].text}"?`;
    log("items[index].depth:" + items[index].depth);

    if (items[index].depth === 0) {
      const nextParentIndex = items.findIndex(function(el, el_index) {
        return el.depth === 0 && el_index > index;
      });

      log({ nextParentIndex });
      // count the number of children
      // number of items with higher index until the next depth 0
      childrenToDelete = items.filter(function(el, el_index) {
        return nextParentIndex > -1
          ? el_index > index && el_index < nextParentIndex
          : el_index > index;
      }).length;

      log({ childrenToDelete });

      if (childrenToDelete > 0) {
        msg = msg + `\n\nThis will also delete ${childrenToDelete} todos...`;
      }
    }

    log({ childrenToDelete });
    // const endOfList = items[index + 1] === undefined;
    // const nextItemIsMoreShallow = items[index].depth;
    const deleteImmediately =
      childrenToDelete === 0 && items[index].text === "";
    if (deleteImmediately) {
      return deleteAtIndex(index);
    }

    if (window.confirm(msg)) {
      return deleteAtIndex(index);
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
  const handleReturn = ({ id, selectionStart, selectionEnd }) => {
    const index = items.findIndex(item => item.id === id);
    let end = selectionEnd;

    if (selectionEnd === selectionStart) {
      end = items[index].text.length;
    }

    const newText = items[index].text.slice(selectionStart, end);

    let updateText = items[index].text.split("");
    updateText.splice(selectionStart, end);
    updateText = updateText.join("");

    handleChange(
      update(
        insert(
          items.map(item => Object.assign(item, { autoFocus: false })),
          {
            id: Date.now(),
            text: newText,
            autoFocus: true
          },
          index
        ),
        {
          [index]: { text: { $set: updateText } }
        }
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
      e.stopPropagation(); //  <------ Here is the magic
    }
  };

  const containerStyle = {};
  if (loading || isFetching) {
    containerStyle["pointerEvents"] = "none";
    containerStyle["opacity"] = 0.65;
  }

  return (
    <div
      onClick={preventEditsWhileLoading}
      onMouseDown={preventEditsWhileLoading}
      style={containerStyle}
    >
      <div>&nbsp;{isFetching && <>Fetching...</>}</div>
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
              onMergeUp={onMergeUp}
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
        rows={20}
        cols={80}
        value={JSON.stringify(numberedItems, null, 4)}
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
