import React, { useContext, Fragment } from "react";

import { QueryContext, tableColorWhiteOnMedium } from "utils";
import { useQuerySpecification } from "services/store";
import { Hx } from "components/LayoutHelpers";
import QueryLoader from "./QueryLoader";
import SavedQueryLoader from "./SavedQueryLoader";
import TableHead from "./TableHead";
import TableBody from "./TableBody";
import ColumnSelector from "components/QueryEditor/ColumnSelector";
import FilterEditor from "components/QueryEditor/FilterEditor";
import MergeData from "components/QueryEditor/MergeData";
import Paginator from "components/QueryEditor/Paginator";
import ProductGuide from "components/ProductGuide";

const GridHead = ({ querySpecification }) => {
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
    <div className={`p-2 pl-6 bg-gray-100 border-gray-300 border-b`}>
      <Hx x="3">
        Showing:{" "}
        {mainTableNames.map((x) => (
          <span
            key={`grd-hd-tbl-${x}`}
            className={`px-2 mr-2 rounded ${tableColorWhiteOnMedium(
              tableColors[x]
            )} text-white`}
          >
            {x}
          </span>
        ))}
        &nbsp;&nbsp;
        <span className="relative">
          <ProductGuide guideFor="gridHead" />
        </span>
      </Hx>
      {embeddedTableNames.length ? (
        <Hx x="5">
          Merged (multiple) records:{" "}
          {embeddedTableNames.map((x) => (
            <span
              key={`grd-hd-tbl-${x}`}
              className={`px-2 mr-2 rounded ${tableColorWhiteOnMedium(
                tableColors[x]
              )} text-white`}
            >
              {x}
            </span>
          ))}
        </Hx>
      ) : null}
    </div>
  );
};

export default () => {
  const queryContext = useContext(QueryContext);
  const querySpecification = useQuerySpecification(
    (state) => state[queryContext.key]
  );

  const Loader =
    !!querySpecification && !!querySpecification.isSavedQuery
      ? SavedQueryLoader
      : QueryLoader;

  return (
    <Loader>
      <Fragment>
        <GridHead querySpecification={querySpecification} />
        <div>
          <table>
            <thead>
              <TableHead />
            </thead>

            <tbody>
              <TableBody />
            </tbody>
          </table>

          {/* <Actions /> */}
          <Paginator />
        </div>

        {queryContext.isColumnSelectorOpen ? <ColumnSelector /> : null}
        {queryContext.isFilterEditorOpen ? <FilterEditor /> : null}
        {queryContext.isMergeUIOpen ? <MergeData /> : null}
      </Fragment>
    </Loader>
  );
};
