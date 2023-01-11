import { useEffect } from "react";

import { useData } from "services/store";
import useSchema from "stores/schema";
import useQuerySpecification from "stores/querySpecification";

interface IPropTypes {
  children: JSX.Element;
}

function QueryLoader({ children }: IPropTypes) {
  // We made this small separate component just for the separate useEffect used here
  // const queryContext = useContext(QueryContext);
  const fetchSchema = useSchema((state) => state.fetchSchema);
  const fetchData = useData((state) => state.fetchData);
  const querySpecification = useQuerySpecification(
    (store) => store.specifications["main"]
  );
  const schema = useSchema((store) =>
    !!querySpecification && !!querySpecification.sourceLabel
      ? store.schemas[querySpecification.sourceLabel]
      : null
  );
  const data = useData((state) => state["main"]);

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

  return <>{children}</>;
}

export default QueryLoader;
