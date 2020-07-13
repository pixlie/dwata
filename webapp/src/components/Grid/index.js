import React, { useContext } from "react";

import { QueryContext } from "utils";
import { useData, useQuerySpecification } from "services/store";
import TableHead from "./TableHead";
import TableBody from "./TableBody";
import QueryLoader from "./QueryLoader";
import SavedQueryLoader from "./SavedQueryLoader";

export default () => {
  const queryContext = useContext(QueryContext);
  const data = useData((state) => state.inner[queryContext.key]);
  const querySpecification = useQuerySpecification(
    (state) => state.inner[queryContext.key]
  );

  if (
    !(data && data.isReady && querySpecification && querySpecification.isReady)
  ) {
    if (!!queryContext.savedQueryId) {
      return <SavedQueryLoader />;
    }
    return <QueryLoader />;
  }

  return (
    <table className="table is-narrow is-fullwidth is-hoverable is-data-table">
      <thead>
        <TableHead />
      </thead>

      <tbody>
        <TableBody />
      </tbody>
    </table>
  );
};
