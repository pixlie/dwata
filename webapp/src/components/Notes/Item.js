import React, { useEffect, useState, Fragment } from "react";
import ReactMarkdown from "react-markdown";

import { saveNote } from "services/apps/actions";
import { Button } from "components/LayoutHelpers";

export default ({ dataItem, isNew, handleCancelCreate }) => {
  const doStates = Object.freeze({
    read: "read",
    edit: "edit",
    preview: "preview", // This is like read, but with the save Button
  });

  const [state, setState] = useState({
    key: "",
    mode: isNew ? doStates.edit : doStates.read,
    content: "",
    dataItem: null,
  });

  useEffect(() => {
    if (dataItem) {
      setState((state) => ({
        ...state,
        content: dataItem.content,
        dataItem,
      }));
    }
  }, [dataItem]);

  const toggleState = (transitionTo) => (event) => {
    event.preventDefault();
    setState((state) => ({
      ...state,
      mode: transitionTo,
    }));
  };

  const handleChange = (event) => {
    const { value } = event.target;
    setState((state) => ({
      ...state,
      content: value,
    }));
  };

  const handleSave = (event) => {
    event.preventDefault();
    saveNote(
      {
        content: state.content,
      },
      state.dataItem && state.dataItem.id ? state.dataItem.id : null
    );
  };

  return (
    <Fragment>
      {state.mode === doStates.edit ? (
        <textarea
          className="border"
          style={{ width: "30rem" }}
          defaultValue={state.content}
          rows="8"
          onChange={handleChange}
        ></textarea>
      ) : (
        <div className="bg-yellow-200 p-2">
          <ReactMarkdown source={state.content} linkTarget="_blank" />
        </div>
      )}
      <div className="buttons">
        {[doStates.edit, doStates.preview].includes(state.mode) ? (
          <Button
            theme="primary"
            disabled={!state.content}
            attributes={{ onClick: handleSave }}
          >
            Save
          </Button>
        ) : null}
        {[doStates.read, doStates.preview].includes(state.mode) ? (
          <Button
            theme="secondary"
            attributes={{ onClick: toggleState(doStates.edit) }}
          >
            Edit note
          </Button>
        ) : null}
        {state.mode === doStates.edit ? (
          <Button
            theme="secondary"
            attributes={{ onClick: toggleState(doStates.preview) }}
          >
            Preview
          </Button>
        ) : null}
        {state.mode === doStates.edit ? (
          <Button
            theme="secondary"
            attributes={{
              onClick: isNew ? handleCancelCreate : toggleState(doStates.read),
            }}
          >
            Cancel
          </Button>
        ) : null}
      </div>
    </Fragment>
  );
};
