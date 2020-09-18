import React, { Fragment, useEffect, useContext } from "react";

import { QueryContext, tableColorWhiteOnMedium } from "utils";
import {
  useApps,
  useData,
  useQueryContext,
  useQuerySpecification,
} from "services/store";
import { Button } from "components/LayoutHelpers";
import ProductGuide from "components/ProductGuide";

const GridStats = () => {
  const queryContext = useContext(QueryContext);
  const querySpecification = useQuerySpecification(
    (state) => state[queryContext.key]
  );
  if (!querySpecification) {
    return null;
  }

  const mainTableNames = [
    ...new Set(querySpecification.columns.map((x) => x.tableName)),
  ];
  const embeddedTableNames = [
    ...new Set(
      querySpecification.embeddedColumns
        .reduce((acc, x) => [...acc, ...x], [])
        .map((x) => x.tableName)
    ),
  ];
  const tableColors = querySpecification.tableColors;

  return (
    <Fragment>
      {mainTableNames.map((x) => (
        <span
          key={`grd-hd-tbl-${x}`}
          className={`inline-block text-xl font-semibold px-2 mr-2 rounded ${tableColorWhiteOnMedium(
            tableColors[x]
          )} text-white cursor-default`}
        >
          {x}
        </span>
      ))}
      {embeddedTableNames.length ? (
        <Fragment>
          {"[ Embedded - "}
          {embeddedTableNames.map((x) => (
            <span
              key={`grd-hd-tbl-${x}`}
              className={`inline-block text-md font-medium px-2 mr-2 rounded ${tableColorWhiteOnMedium(
                tableColors[x]
              )} text-white cursor-default`}
            >
              {x}
            </span>
          ))}
          {"]"}
        </Fragment>
      ) : null}
    </Fragment>
  );
};

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
    <div className="flex items-center">
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
      <div className="block lg:inline-block items-center flex-grow">
        <GridStats />
      </div>

      <div className="block lg:inline-block items-center">
        <span className="relative">
          <Button
            theme="secondary"
            attributes={{
              onClick: handleMergeClick,
            }}
          >
            Related
          </Button>
          <ProductGuide guideFor="relatedButton" />
        </span>

        <Button theme="secondary" attributes={{ onClick: handleColumnsClick }}>
          Columns
        </Button>

        <Button theme="secondary" attributes={{ onClick: handleFiltersClick }}>
          Filters
        </Button>
      </div>
    </div>
  );
};
