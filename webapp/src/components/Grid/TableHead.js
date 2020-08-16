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
  const selectedTableNames =
    "isEmbedded" in queryContext && queryContext.isEmbedded
      ? queryContext.tableName
      : [...new Set(querySpecification.select.map((x) => x.tableName))];
  const selectedTableColumNames = querySpecification.select.map((x) => x.label);

  for (const tableColumnName of data.columns) {
    if (!selectedTableColumNames.includes(tableColumnName)) {
      continue;
    }
    const head = getColumnSchema(schema.rows, tableColumnName);
    if (head.is_primary_key) {
      headList.push(
        <TableHeadItem
          tableColumnName={tableColumnName}
          label={selectedTableNames.length === 1 ? head.name : tableColumnName}
          key={`th-${tableColumnName}`}
        />
      );
    } else {
      headList.push(
        <TableHeadItem
          tableColumnName={tableColumnName}
          label={selectedTableNames.length === 1 ? head.name : tableColumnName}
          key={`th-${tableColumnName}`}
        />
      );
    }
  }

  return (
    <tr className="border-b-4 h-10">
      <th>&nbsp;</th>
      {headList}
    </tr>
  );
};
