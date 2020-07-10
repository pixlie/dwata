import React, { useEffect, useContext } from "react";

import { QueryContext } from "utils";
import useSchema from "services/schema/store";
import useData from "services/data/store";
import useQuerySpecification from "services/querySpecification/store";

export default () => {
  // We made this small separate component just for the separate useEffect used here
  const queryContext = useContext(QueryContext);
  const schema = useSchema((state) => state.inner[queryContext.sourceLabel]);
  const fetchSchema = useSchema((state) => state.fetchSchema);
  const fetchData = useData((state) => state.fetchData);
  const setQuerySpecification = useQuerySpecification(
    (state) => state.setQuerySpecification
  );

  useEffect(() => {
    if (!!queryContext.sourceLabel) {
      if (!schema) {
        fetchSchema(queryContext.sourceLabel);
      }
      fetchData(queryContext.key, queryContext, [setQuerySpecification]);
    }
  }, [queryContext, schema, fetchSchema, fetchData, setQuerySpecification]);

  return <div>Loading data...</div>;
};
