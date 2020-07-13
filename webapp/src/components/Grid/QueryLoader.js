import React, { useEffect, useContext } from "react";

import { QueryContext } from "utils";
import { useSchema, useData, useQuerySpecification } from "services/store";

export default () => {
  // We made this small separate component just for the separate useEffect used here
  const queryContext = useContext(QueryContext);
  const fetchSchema = useSchema((state) => state.fetchSchema);
  const fetchData = useData((state) => state.fetchData);
  const querySpecification = useQuerySpecification(
    (state) => state.inner[queryContext.key]
  );
  const schema = useSchema(
    (state) => state.inner[querySpecification.sourceLabel]
  );
  const setQuerySpecification = useQuerySpecification(
    (state) => state.setQuerySpecification
  );

  useEffect(() => {
    if (!!querySpecification.sourceLabel) {
      if (!schema) {
        fetchSchema(querySpecification.sourceLabel);
      }
      fetchData(queryContext.key, querySpecification, [setQuerySpecification]);
    }
  }, [
    queryContext,
    querySpecification,
    schema,
    fetchSchema,
    fetchData,
    setQuerySpecification,
  ]);

  return <div>Loading data...</div>;
};
