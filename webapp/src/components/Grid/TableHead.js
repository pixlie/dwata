import React, { useContext } from "react";

import { QueryContext } from "utils";
import useData from "services/data/store";
import useSchema from "services/schema/store";
import useQuerySpecification from "services/querySpecification/store";
import TableHeadItem from "./TableHeadItem";

export default () => {
  const queryContext = useContext(QueryContext);
  const data = useData((state) => state.inner[queryContext.key]);
  const schema = useSchema((state) => state.inner[queryContext.sourceLabel]);
  const querySpecification = useQuerySpecification(
    (state) => state.inner[queryContext.key]
  );
  const schemaColumns = schema.rows.find(
    (x) => x.table_name === queryContext.tableName
  ).columns;
  const headList = [];
  const DefaultCell = ({ data }) => <TableHeadItem head={data} />;

  for (const col of data.columns) {
    if (!querySpecification.columnsSelected.includes(col)) {
      continue;
    }
    const head = schemaColumns.find((x) => x.name === col);
    if (head.is_primary_key) {
      headList.push(<DefaultCell data={col} key={`th-${col}`} />);
    } else {
      headList.push(<DefaultCell data={col} key={`th-${col}`} />);
    }
  }

  return (
    <tr>
      <th>&nbsp;</th>
      {headList}
    </tr>
  );
};
