import React, { Fragment, useContext } from "react";

import { QueryContext } from "utils";
import DetailView from "./view";

export default () => {
  const queryContext = useContext(QueryContext);
  const { detailItemList } = queryContext;

  if (!detailItemList) {
    return null;
  }

  return (
    <Fragment>
      {detailItemList.map((x, i) => (
        <DetailView key={`dt-vi-${i}`} item={x} index={i} />
      ))}
    </Fragment>
  );
};
