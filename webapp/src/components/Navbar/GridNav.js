import React, { useEffect, useContext, Fragment } from "react";

import { QueryContext } from "utils";
import { useApps, useData, useQueryContext } from "services/store";
import { Button } from "components/LayoutHelpers";

export default ({ toggleActions, togglePinnedRecords }) => {
  const queryContext = useContext(QueryContext);
  // const showPinnedRecords = useGlobal((state) => state.showPinnedRecords);
  const toggleQueryUI = useQueryContext((state) => state.toggleQueryUI);
  const data = useData((state) => state[queryContext.key]);
  const fetchApps = useApps((state) => state.fetchApps);
  useEffect(() => {
    fetchApps();
  }, [fetchApps]);

  if (!data || !data.isReady) {
    return null;
  }
  const { selectedRowList } = data;

  const handleActionsClick = () => {
    toggleActions();
  };
  /* const handlePinClick = () => {
    togglePinnedRecords();
  }; */
  const handleQueryClick = () => {
    toggleQueryUI(queryContext.key);
  };

  return (
    <Fragment>
      <Button
        theme="secondary"
        active={selectedRowList.length > 0}
        disabled={selectedRowList.length === 0}
        attributes={{ onClick: handleActionsClick }}
      >
        <span className="icon">
          <i className="far fa-check-square" />
        </span>
        &nbsp; Actions
      </Button>
      {/* <Button
        attributes={{ onClick: handlePinClick }}
        active={showPinnedRecords === true}
        theme="secondary"
      >
        <i className="fas fa-thumbtack" />
        &nbsp; Pins
      </Button> */}

      <Button theme="primary" attributes={{ onClick: handleQueryClick }}>
        Query
      </Button>
    </Fragment>
  );
};
