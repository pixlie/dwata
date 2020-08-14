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

  // useEffect(() => {
  //   if (isReady && showPinnedRecords) {
  //     fetchPins();
  //   }
  // }, [isReady, showPinnedRecords, fetchPins]);
  let columns = null,
    rows = null,
    embeddedRows = null,
    selectedRowList = null,
    pins = [],
    showPinnedRecords = false;
  if (data) {
    ({ columns, rows, selectedRowList, embeddedRows } = data);
  }
  const selectedColumLabels = querySpecification.select.map((x) => x.label);

  const rowRendererList = rowRenderer(
    schema.rows,
    columns,
    selectedColumLabels
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
    let classes =
      (embeddedRows.length === 0 ? "border-b " : "") + "hover:bg-gray-100";
    classes = classes + (pinned ? " is-pin" : "");

    const mainRow = (
      <tr onClick={handleRowClick} className={classes}>
        <RowSelectorCell row={row} />
        {row.map((cell, j) => {
          const Cell = rowRendererList[j];
          return Cell !== null ? (
            <Cell key={`td-${index}-${j}`} data={cell} />
          ) : null;
        })}
      </tr>
    );

    if (embeddedRows.length === 0) {
      return mainRow;
    } else {
      return (
        <Fragment>
          {mainRow}
          <tr className={`border-b ${classes}`}>
            <td colSpan={row.length + 1}>Inner stuff</td>
          </tr>
        </Fragment>
      );
    }
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
