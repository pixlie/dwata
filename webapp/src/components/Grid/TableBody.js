import React, { useEffect, Fragment, useContext } from "react";

import { QueryContext } from "utils";
import { useData, useSchema, useQuerySpecification } from "services/store";
import rowRenderer from "./rowRenderer";

export default () => {
  const queryContext = useContext(QueryContext);
  const data = useData((state) => state.inner[queryContext.key]);
  const querySpecification = useQuerySpecification(
    (state) => state.inner[queryContext.key]
  );
  const schema = useSchema(
    (state) => state.inner[querySpecification.sourceLabel]
  );

  // useEffect(() => {
  //   if (isReady && showPinnedRecords) {
  //     fetchPins();
  //   }
  // }, [isReady, showPinnedRecords, fetchPins]);
  let columns = null,
    rows = null,
    selectedRowList = null,
    pins = [],
    showPinnedRecords = false;
  if (data) {
    ({ columns, rows, selectedRowList } = data);
  }

  const rowRendererList = rowRenderer(
    schema.rows.find((x) => x.table_name === querySpecification.tableName)
      .columns,
    columns,
    querySpecification.columnsSelected
  );
  const RowSelectorCell = ({ row }) => {
    const handleRowSelect = (event) => {
      event.preventDefault();
      event.stopPropagation();
      // toggleRowSelection(row[0]);
    };

    const stopPropagation = (event) => {
      event.stopPropagation();
    };

    return (
      <td onClick={handleRowSelect}>
        <input
          className="checkbox"
          type="checkbox"
          onClick={stopPropagation}
          onChange={handleRowSelect}
          checked={selectedRowList.includes(row[0])}
        />
      </td>
    );
  };

  const Row = ({ row, index, pinned = false }) => {
    const handleRowClick = (event) => {
      event.preventDefault();
      // history.push(
      // `/browse/${querySpecification.sourceLabel}/${querySpecification.tableName}/${row[0]}`
      // );
    };

    return (
      <tr onClick={handleRowClick} className={pinned ? "is-pin" : ""}>
        <RowSelectorCell row={row} />
        {row.map((cell, j) => {
          const Cell = rowRendererList[j];
          return Cell !== null ? (
            <Cell key={`td-${index}-${j}`} data={cell} />
          ) : null;
        })}
      </tr>
    );
  };
  const pinnedRowIds = pins && pins.length > 0 ? pins.map((x) => x[2]) : null;

  return (
    <Fragment>
      {pinnedRowIds && showPinnedRecords ? (
        <Fragment>
          {rows
            .filter((x) => pinnedRowIds.includes(x[0]))
            .map((row, i) => (
              <Row key={`tr-${i}`} row={row} index={i} pinned />
            ))}
        </Fragment>
      ) : null}

      {rows.map((row, i) => (
        <Row key={`tr-${i}`} row={row} index={i} />
      ))}
    </Fragment>
  );
};
