import React, { Fragment, useContext } from "react";

import { QueryContext, transformData } from "utils";
import { useData, useSchema, useQuerySpecification } from "services/store";
import rowRenderer from "./rowRenderer";

const generateFilter = (
  mainColumns,
  parentRow,
  parentJoin,
  embeddedColumns
) => {
  const parentRowT = transformData(
    mainColumns.map((x) => x.label),
    parentRow
  );
  // const embeddedTableColumn = parentJoin[0].split(".");
  if (!(parentJoin[1] in parentRowT)) {
    return () => false;
  }

  return (row) => {
    const rowT = transformData(
      embeddedColumns.map((x) => x.label),
      row
    );

    if (parentJoin[0] in rowT) {
      if (rowT[parentJoin[0]] === parentRowT[parentJoin[1]]) {
        return true;
      }
    }
    return false;
  };
};

export default () => {
  const queryContext = useContext(QueryContext);
  const data = useData((state) => state[queryContext.key]);
  const querySpecification = useQuerySpecification(
    (state) => state[queryContext.key]
  );
  const schema = useSchema((state) => state[querySpecification.sourceLabel]);
  let embedded = [];

  if (data) {
    ({ embedded } = data);
  }
  const selectedColumLabels = querySpecification.embeddedColumns[
    queryContext.embeddedDataIndex
  ].map((x) => x.label);
  const parentJoin = embedded[queryContext.embeddedDataIndex].parent_join;
  let filterByParent = generateFilter(
    querySpecification.columns,
    queryContext.parentRow,
    parentJoin,
    querySpecification.embeddedColumns[queryContext.embeddedDataIndex]
  );

  const rowRendererList = rowRenderer(
    schema.rows,
    embedded[queryContext.embeddedDataIndex].columns,
    selectedColumLabels
  );

  const Row = ({ row, index }) => {
    const classes = "border-b hover:bg-gray-100";

    return (
      <tr className={classes}>
        {row.map((cell, j) => {
          const Cell = rowRendererList[j];
          return Cell !== null ? (
            <Cell key={`td-${index}-${j}`} data={cell} />
          ) : null;
        })}
      </tr>
    );
  };

  return (
    <Fragment>
      {embedded[queryContext.embeddedDataIndex].rows
        .filter(filterByParent)
        .map((row, i) => (
          <Row key={`tr-${i}`} row={row} index={i} />
        ))}
    </Fragment>
  );
};
