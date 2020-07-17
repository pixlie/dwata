import React, { useContext } from "react";

import { QueryContext } from "utils";
import useData from "services/data/store";
import useSchema from "services/schema/store";
import useQuerySpecification from "services/querySpecification/store";
import TableHeadItem from "./TableHeadItem";

export default () => {
  const queryContext = useContext(QueryContext);
  const data = useData((state) => state[queryContext.key]);
  const querySpecification = useQuerySpecification(
    (state) => state[queryContext.key]
  );
  const schema = useSchema((state) => state[querySpecification.sourceLabel]);
  const schemaColumns = schema.rows.find(
    (x) => x.table_name === querySpecification.tableName
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
    <tr className="border-b-2">
      <th>&nbsp;</th>
      {headList}
    </tr>
  );
};
