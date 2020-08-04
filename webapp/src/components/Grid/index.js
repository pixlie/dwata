import React, { useContext, Fragment } from "react";

import { QueryContext } from "utils";
import { useQuerySpecification } from "services/store";
// import DetailView from "components/Detail";
import QueryLoader from "./QueryLoader";
import SavedQueryLoader from "./SavedQueryLoader";
import QueryEditor from "components/QueryEditor";
import MergeData from "components/QueryEditor/MergeData";
import Paginator from "components/QueryEditor/Paginator";
import TableHead from "./TableHead";
import TableBody from "./TableBody";

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
