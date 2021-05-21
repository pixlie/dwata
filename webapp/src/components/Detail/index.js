import { useContext } from "react";

import * as globalConstants from "services/global/constants";
import { QueryContext } from "utils";
import Create from "./Create";
import Read from "./Read";

export default () => {
  const queryContext = useContext(QueryContext);
  const { detailItemList } = queryContext;
  const operationView = {
    [globalConstants.OBJECT_CREATE]: Create,
    [globalConstants.OBJECT_READ]: Read,
  };

  if (!detailItemList) {
    return null;
  }

  const details = [];
  for (const i in detailItemList) {
    const x = detailItemList[i];
    const View = operationView[x.operation];
    details.push(<View key={`dt-vi-${i}`} item={x} index={i} />);
  }

  return <>{details}</>;
};
