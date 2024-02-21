import { useContext } from "react";

import { QueryContext } from "utils";
import { useSchema, useQuerySpecification } from "services/store";
import { getColumnSchema } from "services/querySpecification/getters";
import TableHeadItem from "./TableHeadItem";

const EmbeddedTableHead = () => {
  const queryContext = useContext(QueryContext);
  const querySpecification = useQuerySpecification(
    (state) => state[queryContext.key]
  );
  const schema = useSchema((state) => state[querySpecification.sourceLabel]);
  const headList = [];
  const _columns =
    querySpecification.embeddedColumns[queryContext.embeddedDataIndex];
  const selectedTableNames = [
    ...new Set(
      querySpecification.embeddedColumns[queryContext.embeddedDataIndex].map(
        (x) => x.tableName
      )
    ),
  ];
  const selectedTableColumNames = querySpecification.embeddedColumns[
    queryContext.embeddedDataIndex
  ].map((x) => x.label);

  for (const col of _columns) {
    const tableColumnName = col.label;
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
      headList.push(
        <th
          key={`th-${col.tableName}-exp`}
          className="border border-gray-300 px-2 py-1 text-left"
        ></th>
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

  return <tr className="bg-gray-100 border-b-2 h-10">{headList}</tr>;
};

export default EmbeddedTableHead;
