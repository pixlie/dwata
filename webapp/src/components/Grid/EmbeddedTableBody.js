import React, { Fragment, useContext } from "react";

import { QueryContext, transformData } from "utils";
import { useData, useSchema, useQuerySpecification } from "services/store";
import rowRenderer from "./rowRenderer";

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
  const parentRow = transformData(
    querySpecification.columns.map((x) => x.label),
    queryContext.parentRow
  );
  const parentJoin = embedded[queryContext.embeddedDataIndex].parent_join;
  let filterByParent = () => true;
  if (parentJoin[1] in Object.keys(parentRow)) {
    const parentValue = parentRow[parentJoin[1]];
    filterByParent = (row) => {
      const _row = transformData(selectedColumLabels, row);
      if (parentJoin[0] in Object.keys(_row)) {
        if (_row[parentJoin[0]] === parentValue) {
          return true;
        }
      }
      return false;
    };
  }

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
