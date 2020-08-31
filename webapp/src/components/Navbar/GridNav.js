import React, { useEffect, useContext, Fragment } from "react";

import { QueryContext } from "utils";
import {
  useApps,
  useData,
  useQueryContext,
  useProductGuide,
} from "services/store";
import { Button } from "components/LayoutHelpers";

export default ({ toggleActions, togglePinnedRecords }) => {
  const queryContext = useContext(QueryContext);
  // const showPinnedRecords = useGlobal((state) => state.showPinnedRecords);
  const toggleColumnSelector = useQueryContext(
    (state) => state.toggleColumnSelector
  );
  const toggleFilterEditor = useQueryContext(
    (state) => state.toggleFilterEditor
  );
  const toggleMergeUI = useQueryContext((state) => state.toggleMergeUI);
  const data = useData((state) => state[queryContext.key]);
  const fetchApps = useApps((state) => state.fetchApps);
  const setPGPosition = useProductGuide((state) => state.setPGPosition);
  useEffect(() => {
    fetchApps();
  }, [fetchApps]);

  if (!data || !data.isReady) {
    return null;
  }
  // const { selectedRowList } = data;

  // const handleActionsClick = () => {
  //   toggleActions();
  // };
  /* const handlePinClick = () => {
    togglePinnedRecords();
  }; */
  const handleColumnsClick = () => {
    toggleColumnSelector(queryContext.key);
  };
  const handleFiltersClick = () => {
    toggleFilterEditor(queryContext.key);
  };
  const handleMergeClick = () => {
    toggleMergeUI(queryContext.key);
  };

  return (
    <Fragment>
      {/* <Button
        theme="secondary"
        active={selectedRowList.length > 0}
        disabled={selectedRowList.length === 0}
        attributes={{ onClick: handleActionsClick }}
      >
        <span className="icon">
          <i className="far fa-check-square" />
        </span>
        &nbsp; Actions
      </Button> */}
      {/* <Button
        attributes={{ onClick: handlePinClick }}
        active={showPinnedRecords === true}
        theme="secondary"
      >
        <i className="fas fa-thumbtack" />
        &nbsp; Pins
      </Button> */}

      <Button
        theme="secondary"
        attributes={{
          onClick: handleMergeClick,
          ref: (el) => {
            el && setPGPosition("relatedButton", el.getBoundingClientRect());
          },
        }}
      >
        Related
      </Button>

      <Button theme="secondary" attributes={{ onClick: handleColumnsClick }}>
        Columns
      </Button>

      <Button theme="secondary" attributes={{ onClick: handleFiltersClick }}>
        Filters
      </Button>
    </Fragment>
  );
};
