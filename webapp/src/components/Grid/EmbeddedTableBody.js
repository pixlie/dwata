import React, { Fragment, useContext } from "react";

import { QueryContext } from "utils";
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
      {embedded[queryContext.embeddedDataIndex].rows.map((row, i) => (
        <Row key={`tr-${i}`} row={row} index={i} />
      ))}
    </Fragment>
  );
};
