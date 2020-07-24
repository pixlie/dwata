import React, { useEffect, useState, useContext, Fragment } from "react";
import ReactMarkdown from "react-markdown";

import { QueryContext } from "utils";
import { saveNote } from "services/apps/actions";
import { Button } from "components/LayoutHelpers";

const getQuerySpecificationForNote = (querySpecification) => {
  let tablesOnly = [];
  for (const sl of querySpecification.select) {
    tablesOnly.push(sl.tableName);
  }
  tablesOnly = [...new Set(tablesOnly)];

  return JSON.stringify({
    sourceLabel: querySpecification.sourceLabel,
    select: tablesOnly,
  });
};

export default ({ note = null, isNew, handleCancelCreate }) => {
  const queryContext = useContext(QueryContext);

  const doStates = Object.freeze({
    read: "read",
    edit: "edit",
    preview: "preview", // This is like read, but with the save Button
  });
  const [state, setState] = useState({
    key: "",
    mode: isNew ? doStates.edit : doStates.read,
    content: note ? note.content : "",
    note,
  });

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

  const handleSave = () => {
    saveNote(
      getQuerySpecificationForNote(queryContext.currentQS),
      state.content,
      state.note && state.note.id ? state.note.id : null
    );
  };
  const qS = isNew ? {} : JSON.parse(note.query_specification);

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
        <div className="mb-2">
          <div className="bg-yellow-200 p-2">
            <ReactMarkdown source={state.content} linkTarget="_blank" />
          </div>
          {!isNew ? (
            <div className="text-sm text-right">
              In {qS.sourceLabel}/{qS.select[0]}, &nbsp;
              <Button
                theme="link"
                attributes={{ onClick: toggleState(doStates.edit) }}
              >
                edit note
              </Button>
            </div>
          ) : null}
        </div>
      )}
      {[doStates.edit, doStates.preview].includes(state.mode) ? (
        <Button
          theme="primary"
          disabled={!state.content}
          attributes={{ onClick: handleSave }}
        >
          Save
        </Button>
      ) : null}
      {[doStates.preview].includes(state.mode) ? (
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
    </Fragment>
  );
};
