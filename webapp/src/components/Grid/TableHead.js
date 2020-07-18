import React, { useContext } from "react";

import { QueryContext } from "utils";
import { useData, useSchema, useQuerySpecification } from "services/store";
import { getColumnSchema } from "services/querySpecification/getters";
import TableHeadItem from "./TableHeadItem";

export default () => {
  const queryContext = useContext(QueryContext);
  const data = useData((state) => state[queryContext.key]);
  const querySpecification = useQuerySpecification(
    (state) => state[queryContext.key]
  );
  const schema = useSchema((state) => state[querySpecification.sourceLabel]);
  const headList = [];

  for (const col of data.columns) {
    if (!querySpecification.select.includes(col)) {
      continue;
    }
    const head = getColumnSchema(schema.rows, col);
    if (head.is_primary_key) {
      headList.push(<TableHeadItem head={col} key={`th-${col}`} />);
    } else {
      headList.push(<TableHeadItem head={col} key={`th-${col}`} />);
    }
  }

  return (
    <tr className="border-b-2">
      <th>&nbsp;</th>
      {headList}
    </tr>
  );
};
