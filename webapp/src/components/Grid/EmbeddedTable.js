import React, { Fragment, useContext } from "react";

import { QueryContext } from "utils";
import EmbeddedTableHead from "./EmbeddedTableHead";
import EmbeddedTableBody from "./EmbeddedTableBody";

export default ({ embedContext }) => {
  const queryContext = useContext(QueryContext);
  const ctx = {
    isEmbedded: true,
    ...embedContext,
    key: queryContext.key,
  };

  return (
    <QueryContext.Provider value={ctx}>
      <Fragment>
        <div>
          <table className="border">
            <thead>
              <EmbeddedTableHead />
            </thead>

            <tbody>
              <EmbeddedTableBody />
            </tbody>
          </table>
        </div>
      </Fragment>
    </QueryContext.Provider>
  );
};
