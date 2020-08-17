import React, { useContext, Fragment } from "react";

import { QueryContext } from "utils";
import { useQuerySpecification } from "services/store";
import { Hx } from "components/LayoutHelpers";
// import DetailView from "components/Detail";
import QueryLoader from "./QueryLoader";
import SavedQueryLoader from "./SavedQueryLoader";
import QueryEditor from "components/QueryEditor";
import MergeData from "components/QueryEditor/MergeData";
import Paginator from "components/QueryEditor/Paginator";
import TableHead from "./TableHead";
import TableBody from "./TableBody";

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

  return (
    <div className="p-2 pl-6 bg-gray-200 border-b">
      <Hx x="3">Showing: {mainTableNames.join(", ")}</Hx>
      {embeddedTableNames.length ? (
        <Hx x="5">
          Merged (multiple) records: {embeddedTableNames.join(", ")}
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

        {queryContext.isQueryUIOpen ? <QueryEditor /> : null}
        {queryContext.isMergeUIOpen ? <MergeData /> : null}
      </Fragment>
    </Loader>
  );
};
