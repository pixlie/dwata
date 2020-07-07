import React, { useCallback, useEffect, useState, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import ReactMarkdown from "react-markdown";

import { showNotes } from "services/global/actions";
import { fetchNote, saveNote } from "services/apps/actions";

const defaultNote = `# Report
Reports are a mix of data from different queries and optional notes to either:
- Make it easy to consume most important Business data internally
- Share customer specific Business data with your customers

What do reports consist of:
- Data from any Saved Query
- Notes to explain parts of the report
- Widgets to allow users to manipulate the data like date range

The notes inside reports supports [Markdown](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet)
syntax, which is automatically converted to HTML.
`;

const Notes = ({
  isReady,
  showNotesFor,
  isNoteAppEnabled,
  dataItem,
  showNotes,
  fetchNote,
  saveNote,
}) => {
  const handleKey = useCallback(
    (event) => {
      if (event.keyCode === 27) {
        showNotes(null);
      }
    },
    [showNotes]
  );
  useEffect(() => {
    document.addEventListener("keydown", handleKey, false);

    return () => {
      document.removeEventListener("keydown", handleKey, false);
    };
  }, [handleKey]);
  const doStates = Object.freeze({
    read: "read",
    edit: "edit",
    preview: "preview", // This is like read, but with the save button
  });
  const [state, setState] = useState({
    current: doStates.read,
    content: defaultNote,
    existingNote: {},
  });
  useEffect(() => {
    fetchNote();
    setState((state) => ({
      ...state,
      content: defaultNote,
    }));
  }, [showNotesFor, fetchNote]);
  useEffect(() => {
    if (dataItem) {
      setState((state) => ({
        ...state,
        content: dataItem.content,
        existingNote: dataItem,
      }));
    }
  }, [dataItem]);
  const toggleState = (transitionTo) => (event) => {
    event.preventDefault();
    setState((state) => ({
      ...state,
      current: transitionTo,
    }));
  };
  const handleChange = (event) => {
    const { value } = event.target;
    setState((state) => ({
      ...state,
      content: value,
    }));
  };

  if (!isNoteAppEnabled || !isReady) {
    return null;
  }

  const handleSave = (event) => {
    event.preventDefault();
    saveNote(
      {
        content: state.content,
      },
      state.existingNote.id ? state.existingNote.id : null
    );
  };

  return (
    <Fragment>
      {state.current === doStates.edit ? (
        <div className="field">
          <div className="control">
            <textarea
              className="textarea"
              defaultValue={state.content}
              rows="12"
              onChange={handleChange}
            ></textarea>
          </div>
        </div>
      ) : (
        <div className="content">
          <ReactMarkdown source={state.content} linkTarget="_blank" />
        </div>
      )}
      <div className="buttons">
        {[doStates.edit, doStates.preview].includes(state.current) ? (
          <button
            className="button is-primary"
            disabled={defaultNote === state.content}
            onClick={handleSave}
          >
            Save
          </button>
        ) : null}
        {[doStates.read, doStates.preview].includes(state.current) ? (
          <button
            className="button is-primary"
            onClick={toggleState(doStates.edit)}
          >
            Edit this note
          </button>
        ) : null}
        {state.current === doStates.edit ? (
          <button
            className="button is-light"
            onClick={toggleState(doStates.preview)}
          >
            Preview
          </button>
        ) : null}
        {state.current === doStates.edit ? (
          <button
            className="button is-light"
            onClick={toggleState(doStates.read)}
          >
            Cancel
          </button>
        ) : null}
      </div>
    </Fragment>
  );
};

const mapStateToProps = (state, props) => {
  const { showNotesFor } = props;
  const { isNoteAppEnabled, noteAppConfig } = state.apps;
  const { source_id: sourceId, table_name: tableName } = noteAppConfig;
  const _cacheKey = `${sourceId}/${tableName}/${btoa(showNotesFor)}`;

  if (showNotesFor !== null) {
    return {
      isReady: true,
      isNoteAppEnabled,
      showNotesFor,
      cacheKey: _cacheKey,
      dataItem: Object.keys(state.dataItem).includes(_cacheKey)
        ? state.dataItem[_cacheKey].data
        : null,
    };
  }

  return {
    isReady: false,
    cacheKey: _cacheKey,
    showNotesFor,
  };
};

export default withRouter(
  connect(mapStateToProps, {
    showNotes,
    fetchNote,
    saveNote,
  })(Notes)
);
