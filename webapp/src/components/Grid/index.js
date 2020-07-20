import React, { useContext, Fragment } from "react";

import { QueryContext } from "utils";
import { useQuerySpecification } from "services/store";
// import DetailView from "components/Detail";
import QueryEditor from "components/QueryEditor";
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
        <table>
          <thead>
            <TableHead />
          </thead>

          <tbody>
            <TableBody />
          </tbody>
        </table>

        {queryContext.isQueryUIOpen ? <QueryEditor /> : null}
        {/* <Actions /> */}
        <Paginator />
      </Fragment>
    </Loader>
  );
};
