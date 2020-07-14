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
  const data = useData((state) => state[queryContext.key]);
  const querySpecification = useQuerySpecification(
    (state) => state[queryContext.key]
  );
  const schema = useSchema((state) => state[querySpecification.sourceLabel]);

  if (
    !(
      data &&
      data.isReady &&
      querySpecification &&
      querySpecification.isReady &&
      schema &&
      schema.isReady
    )
  ) {
    if (!!queryContext.savedQueryId) {
      return <SavedQueryLoader />;
    }
    return <QueryLoader />;
  }

  return (
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
  );
};
