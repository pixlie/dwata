import React, { Fragment, useState } from "react";

// import { saveQuery } from "services/apps/actions";
import { Button, Hx } from "components/LayoutHelpers";
import ColumnSelectorInner from "./ColumnSelector";
import FilterEditorInner from "./FilterEditor";
import OrderEditorInner from "./OrderEditor";
import RelatedData from "./RelatedData";

export default () => {
  const [state, setState] = useState({
    isSavingQuery: false,
    savedQueryLabel: "",
    openEditor: "column",
  });

  const handleSaveQuery = async () => {
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
  };

  return (
    <div className="fixed bottom-0 right-0 h-screen max-w-md bg-gray-700 px-2">
      <div className="block w-full lg:inline-block lg:mt-0 p-4">&nbsp;</div>

      <div className="w-full">
        {state.openEditor === "column" ? (
          <div className="bg-gray-100 my-1 rounded-md px-2 py-1">
            <ColumnSelectorInner />
          </div>
        ) : (
          <div
            className="bg-gray-100 my-1 rounded-md px-2 py-1 cursor-pointer"
            onClick={handleChangeEditor("column")}
          >
            <Hx x="4">Columns</Hx>
          </div>
        )}

        {state.openEditor === "filter" ? (
          <div className="bg-gray-100 my-1 rounded-md px-2 py-1">
            <FilterEditorInner />
          </div>
        ) : (
          <div
            className="bg-gray-100 my-1 rounded-md px-2 py-1 cursor-pointer"
            onClick={handleChangeEditor("filter")}
          >
            <Hx x="4">Filters</Hx>
          </div>
        )}

        {state.openEditor === "ordering" ? (
          <div className="bg-gray-100 my-1 rounded-md px-2 py-1">
            <OrderEditorInner />
          </div>
        ) : (
          <div
            className="bg-gray-100 my-1 rounded-md px-2 py-1 cursor-pointer"
            onClick={handleChangeEditor("ordering")}
          >
            <Hx x="4">Ordering</Hx>
          </div>
        )}

        {state.openEditor === "related" ? (
          <div className="bg-gray-100 my-1 rounded-md px-2 py-1">
            <RelatedData />
          </div>
        ) : (
          <div
            className="bg-gray-100 my-1 rounded-md px-2 py-1 cursor-pointer"
            onClick={handleChangeEditor("related")}
          >
            <Hx x="4">Related</Hx>
          </div>
        )}
      </div>

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
    </div>
  );
};
