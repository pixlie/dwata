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

const GridStats = ({ size = "md" }) => {
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

  let sizeClasses = "";
  if (size === "sm") {
    sizeClasses = "text-xs font-medium leading-5";
  } else {
    sizeClasses = "text-sm font-medium leading-6";
  }

  return (
    <Fragment>
      {mainTableNames.map((x) => (
        <span
          key={`grd-hd-tbl-${x}`}
          className={`inline-block px-2 mr-2 rounded ${sizeClasses} ${tableColorWhiteOnMedium(
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
              className={`inline-block text-xs font-medium px-2 mr-2 rounded ${tableColorWhiteOnMedium(
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

export default ({
  showRelated = true,
  size = "md",
  toggleActions,
  togglePinnedRecords,
}) => {
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
    <div className="flex">
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
        <GridStats size={size} />
      </div>

      <div className="block lg:inline-block items-center">
        {showRelated ? (
          <span className="relative">
            <Button
              size={size}
              theme="secondary"
              attributes={{
                onClick: handleMergeClick,
              }}
            >
              <i className="fas fa-link" /> Related
            </Button>
            <ProductGuide guideFor="relatedButton" />
          </span>
        ) : null}

        <Button
          size={size}
          theme="secondary"
          attributes={{ onClick: handleColumnsClick }}
        >
          <i className="fas fa-eye" /> Columns
        </Button>

        <Button
          size={size}
          theme="secondary"
          attributes={{ onClick: handleFiltersClick }}
        >
          <i className="fas fa-search" /> Filters
        </Button>
      </div>
    </div>
  );
};
