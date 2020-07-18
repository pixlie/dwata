import React, { Fragment, useState, useContext } from "react";

import { QueryContext } from "utils";
import { useQuerySpecification } from "services/store";
// import { saveQuery } from "services/apps/actions";
import { Modal, Button } from "components/LayoutHelpers";
import ColumnSelectorInner from "./ColumnSelector";
import FilterEditorInner from "./FilterEditor";
import OrderEditorInner from "./OrderEditor";
// import RelatedData from "./RelatedData";

export default () => {
  const queryContext = useContext(QueryContext);
  const querySpecification = useQuerySpecification(
    (state) => state[queryContext.key]
  );

  const [state, setState] = useState({
    isSavingQuery: false,
    savedQueryLabel: "",
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

  const cancelSaveQuery = (event) => {
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
    <Modal theme="light">
      <div className="flex items-stretch">
        <div className="flex-1 px-2">
          <ColumnSelectorInner />
        </div>

        <div className="flex-1 px-2">
          <FilterEditorInner />
        </div>

        <div className="flex-1 px-2">
          <OrderEditorInner />
        </div>

        <div className="flex-1 px-2">{/* <RelatedData /> */}</div>
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
    </Modal>
  );
};
