import React, { useEffect, useContext, Fragment } from "react";

import { QueryContext } from "utils";
import { useSchema, useData, useQuerySpecification } from "services/store";

function QueryLoader({ children }) {
  // We made this small separate component just for the separate useEffect used here
  const queryContext = useContext(QueryContext);
  const fetchSchema = useSchema((state) => state.fetchSchema);
  const fetchData = useData((state) => state.fetchData);
  const querySpecification = useQuerySpecification(
    (state) => state[queryContext.key]
  );
  const schema = useSchema((state) =>
    !!querySpecification && !!querySpecification.sourceLabel
      ? state[querySpecification.sourceLabel]
      : null
  );
  const data = useData((state) => state[queryContext.key]);

  useEffect(() => {
    if (!!querySpecification && !!querySpecification.sourceLabel) {
      fetchSchema(querySpecification.sourceLabel);
    }
  }, [querySpecification, fetchSchema]);

  useEffect(() => {
    if (!!querySpecification && !!querySpecification.fetchNeeded) {
      fetchData(queryContext.key, querySpecification);
    }
  }, [querySpecification, queryContext.key, fetchData]);

  if (!(data && querySpecification && schema)) {
    return <div>Loading...</div>;
  }

  if (!(data.isReady && querySpecification.isReady && schema.isReady)) {
    return <div>Loading data...</div>;
  }

  return <Fragment>{children}</Fragment>;
}

export default QueryLoader;
