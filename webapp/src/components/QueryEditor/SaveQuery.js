import React, { Fragment, useState } from "react";

export default () => {
  const [state, setState] = useState({
    isSavingQuery: false,
    savedQueryLabel: "",
  });
  /* const handleSaveQuery = async () => {
    if (state.isSavingQuery) {
      // await saveQuery(state.savedQueryLabel, querySpecification);
    } else {
      setState((state) => ({
        ...state,
        isSavingQuery: true,
      }));
    }
  };

  const handleChangeEditor = (name) => () =>
    setState({
      openEditor: name,
    });

  const cancelSaveQuery = () => {
    setState((state) => ({
      ...state,
      isSavingQuery: false,
    }));
  };

  const handleSavedFilterLabelChange = (event) => {
    const { value } = event.target;
    setState((state) => ({
      ...state,
      savedQueryLabel: value,
    }));
  }; */

  return (
    <Fragment>
      {state.openEditor === "filter" ? (
        <div className="bg-white border my-1 rounded-md px-2 py-1">
          <FilterEditorInner />
        </div>
      ) : (
        <div
          className="bg-white border my-1 rounded-md px-2 py-1 cursor-pointer"
          onClick={handleChangeEditor("filter")}
        >
          <Hx x="4">Filters</Hx>
        </div>
      )}

      {state.isSavingQuery ? (
        <div className="field">
          <div className="control">
            <input
              className="input"
              onChange={handleSavedFilterLabelChange}
              value={state.savedQueryLabel}
              placeholder="Label for this Query"
            />
          </div>
        </div>
      ) : null}

      <div className="buttons">
        {state.isSavingQuery ? (
          <Fragment>
            <Button attributes={{ onClick: handleSaveQuery }}>
              Save Query
            </Button>
            <Button attributes={{ onClick: cancelSaveQuery }}>Cancel</Button>
          </Fragment>
        ) : (
          <Fragment>
            <Button attributes={{ onClick: handleSaveQuery }}>
              Save Query
            </Button>
            <Button attributes={{ onClick: () => {} }}>Add to Funnel</Button>
          </Fragment>
        )}
      </div>
    </Fragment>
  );
};
