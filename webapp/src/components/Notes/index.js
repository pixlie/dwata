import React, { useCallback, useEffect, useState } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import ReactMarkdown from "react-markdown";

import { showNotes, fetchNote, saveNote } from "services/global/actions";
import { Section, Hx } from "components/BulmaHelpers";


const defaultNote = `# Notes
Notes help you and your team save time to understand data in relation to your business.
Notes are great documentation for onboarding new team members.

You can use notes to:
- Explain what some tables do
- Which tables are important at which stage of business
- Which tables are important for which teams in your business

The notes editor supports [Markdown](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet) syntax, which is automatically convered to HTML.
`;


const Notes = ({isReady, showNotesFor, isNoteAppEnabled, dataItem, showNotes, fetchNote, saveNote}) => {
  const handleKey = useCallback(event => {
    if (event.keyCode === 27) {
      showNotes(null);
    }
  }, []);
  useEffect(() => {
    document.addEventListener("keydown", handleKey, false);

    return () => {
      document.removeEventListener("keydown", handleKey, false);
    }
  }, []);
  useEffect(() => {
    console.log(showNotesFor);
    fetchNote();
  }, [showNotesFor]);
  const doStates = Object.freeze({
    read: "read",
    edit: "edit",
    preview: "preview",  // This is like read, but with the save button
  });
  const [state, setState] = useState({
    current: doStates.read,
    content: dataItem || defaultNote,
    existingNote: {},
  });
  useEffect(() => {
    setState({
      ...state,
      content: dataItem ? dataItem.content : defaultNote,
      existingNote: dataItem ? dataItem : {},
    });
  }, [dataItem]);
  const toggleState = transitionTo => event => {
    event.preventDefault();
    setState({
      ...state,
      current: transitionTo,
    });
  }
  const handleChange = event => {
    event.preventDefault();
    setState({
      ...state,
      content: event.target.value,
    });
  }

  if (!isNoteAppEnabled || !isReady) {
    return null;
  }
  const handleClose = event => {
    event.preventDefault();
    showNotes(null);
  }

  const handleSave = event => {
    event.preventDefault();
    saveNote({
      content: state.content,
    }, state.existingNote ? state.existingNote.id : null);
  }

  return (
    <div id="notes-modal">
      <Section>
        <button className="button is-rounded is-dark close" onClick={handleClose}>
          Close&nbsp;<i className="fas fa-times"></i>
        </button>

        {state.current === doStates.edit ? (
          <div className="field">
            <div className="control">
              <textarea className="textarea" defaultValue={state.content} rows="12" onChange={handleChange}></textarea>
            </div>
          </div>
        ) : (
          <div className="content">
            <ReactMarkdown source={state.content} linkTarget="_blank" />
          </div>
        )}
        <div className="buttons">
          {[doStates.edit, doStates.preview].includes(state.current) ?
            <button className="button is-primary" disabled={defaultNote === state.content} onClick={handleSave}>Save</button>
          : null}
          {[doStates.read, doStates.preview].includes(state.current) ? <button className="button is-primary" onClick={toggleState(doStates.edit)}>Edit note</button> : null}
          {state.current === doStates.edit ? <button className="button is-light" onClick={toggleState(doStates.preview)}>Preview</button> : null}
          {state.current === doStates.edit ? <button className="button is-light" onClick={toggleState(doStates.read)}>Cancel</button> : null}
        </div>
      </Section>
    </div>
  );
}


const mapStateToProps = state => {
  const {showNotesFor, isNoteAppEnabled, noteAppConfig} = state.global;
  const {source_id: sourceId, table_name: tableName} = noteAppConfig;
  const _cacheKey = `${sourceId}/${tableName}/${showNotesFor}`;
  console.log(_cacheKey);

  let isReady = false;
  if (showNotesFor !== null && _cacheKey in state.dataItem && state.dataItem[_cacheKey].isReady) {
    isReady = true;
  }

  if (isReady) {
    return {
      isReady,
      isNoteAppEnabled,
      showNotesFor,
      cacheKey: _cacheKey,
      dataItem: state.dataItem[_cacheKey].data,
    }
  } else {
    return {
      isReady,
      cacheKey: _cacheKey,
      showNotesFor,
    };
  }
}


export default withRouter(connect(
  mapStateToProps,
  {
    showNotes,
    fetchNote,
    saveNote,
  }
)(Notes));