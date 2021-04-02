import { useContext } from "react";

import { QueryContext } from "utils";
import { useSchema, useQuerySpecification } from "services/store";
import { getColumnSchema } from "services/querySpecification/getters";
import TableHeadItem from "./TableHeadItem";

const TableHead = () => {
  const queryContext = useContext(QueryContext);
  const querySpecification = useQuerySpecification(
    (state) => state[queryContext.key]
  );
  const schema = useSchema((state) => state[querySpecification.sourceLabel]);
  const tableColors = querySpecification.tableColors;
  const headList = [];
  let selectedTableColumNames = [],
    _columns = [];

  if ("isEmbedded" in queryContext && queryContext.isEmbedded) {
    selectedTableColumNames = querySpecification.embeddedColumns[
      queryContext.embeddedDataIndex
    ].map((x) => x.label);
    _columns =
      querySpecification.embeddedColumns[queryContext.embeddedDataIndex];
  } else {
    selectedTableColumNames = querySpecification.columns.map((x) => x.label);
    _columns = querySpecification.columns;
  }

  if (querySpecification.isRowSelectable) {
    headList.push(
      <th key="th-row-sel" className="border border-gray-300 px-2 text-left" />
    ); // This is for the row selector
  }
  for (const [i, col] of _columns.entries()) {
    const tableColumnName = col.label;
    if (!selectedTableColumNames.includes(tableColumnName)) {
      continue;
    }
    const head = getColumnSchema(schema.rows, tableColumnName);
    if (head.is_primary_key) {
      headList.push(
        <TableHeadItem
          key={`th-${tableColumnName}`}
          index={i}
          tableColumnName={tableColumnName}
          label={head.name}
          tableColor={tableColors[col.tableName]}
        />
      );
      headList.push(
        <th
          key={`th-${col.tableName}-exp`}
          className="border border-gray-300 px-2 text-left"
        ></th>
      );
    } else {
      headList.push(
        <TableHeadItem
          key={`th-${tableColumnName}`}
          index={i}
          tableColumnName={tableColumnName}
          label={head.name}
          tableColor={tableColors[col.tableName]}
        />
      );
    }
  }

  return <tr className="bg-gray-100 h-10">{headList}</tr>;
};

export default TableHead;
