import React, { Fragment, useContext } from "react";

import { QueryContext } from "utils";
import TableHead from "./TableHead";
// import TableBody from "./TableBody";

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
          <table>
            <thead>
              <TableHead />
            </thead>

            <tbody>{/* <TableBody /> */}</tbody>
          </table>
        </div>
      </Fragment>
    </QueryContext.Provider>
  );
};
