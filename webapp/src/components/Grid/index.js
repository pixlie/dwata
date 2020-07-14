import React, { useContext, Fragment } from "react";

import { QueryContext } from "utils";
import { useData, useSchema, useQuerySpecification } from "services/store";
// import DetailView from "components/Detail";
import ColumnSelector from "components/QueryEditor/ColumnSelector";
import FilterEditor from "components/QueryEditor/FilterEditor";
import OrderEditor from "components/QueryEditor/OrderEditor";
import Paginator from "components/QueryEditor/Paginator";
import TableHead from "./TableHead";
import TableBody from "./TableBody";
import QueryLoader from "./QueryLoader";
import SavedQueryLoader from "./SavedQueryLoader";

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
        <table className="table is-narrow is-fullwidth is-hoverable is-data-table">
          <thead>
            <TableHead />
          </thead>

          <tbody>
            <TableBody />
          </tbody>
        </table>

        <ColumnSelector />
        <FilterEditor />
        <OrderEditor />
        {/* <Actions /> */}
        <Paginator />
      </Fragment>
    </Loader>
  );
};
