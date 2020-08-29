import React, { Fragment, useState, useContext } from "react";

import { QueryContext } from "utils";
import {
  useData,
  useSchema,
  useQuerySpecification,
  useQueryContext,
} from "services/store";
import rowRenderer from "./rowRenderer";
import EmbeddedTable from "./EmbeddedTable";

export default () => {
  const [state, setState] = useState({
    selectedRowIndex: null,
    selectedEmbeddedDataIndex: null,
  });
  const queryContext = useContext(QueryContext);
  const data = useData((state) => state[queryContext.key]);
  const querySpecification = useQuerySpecification(
    (state) => state[queryContext.key]
  );
  const schema = useSchema((state) => state[querySpecification.sourceLabel]);
  const toggleDetailItem = useQueryContext((state) => state.toggleDetailItem);

  // useEffect(() => {
  //   if (isReady && showPinnedRecords) {
  //     fetchPins();
  //   }
  // }, [isReady, showPinnedRecords, fetchPins]);
  let columns = null,
    rows = null,
    embedded = null,
    selectedRowList = null,
    pins = [],
    showPinnedRecords = false;
  if (data) {
    ({ columns, rows, selectedRowList, embedded } = data);
  }
  const selectedColumLabels = querySpecification.columns.map((x) => x.label);
  const embeddedTableNames = [
    ...new Set(
      querySpecification.embeddedColumns
        .reduce((acc, x) => [...acc, ...x], [])
        .map((x) => x.tableName)
    ),
  ];

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

  const RowWithoutEmbed = ({ row, index, pinned = false }) => {
    // This is a normal grid row that does not show embedded grid inside it.
    const handleRowClick = () => {
      toggleDetailItem({
        sourceLabel: querySpecification.sourceLabel,
        tableName: querySpecification.select[0].tableName,
        pk: row[0],
      });
    };
    let classes = "border-b hover:bg-gray-100";
    classes = classes + (pinned ? " is-pin" : "");

    return (
      <tr onClick={handleRowClick} className={classes}>
        {/* <RowSelectorCell row={row} /> */}
        {row.map((cell, j) => {
          const Cell = rowRendererList[j];
          return Cell !== null ? (
            <Cell key={`td-${index}-${j}`} data={cell} />
          ) : null;
        })}
      </tr>
    );
  };

  const RowWithEmbed = ({ row, index, pinned = false }) => {
    // This is a grid row that expands the merged (embedded) data that is related to this row.
    const handleRowClick = () => {
      toggleDetailItem({
        sourceLabel: querySpecification.sourceLabel,
        tableName: querySpecification.tableName,
        pk: row[0],
      });
    };
    let classes =
      (embedded.length === 0 ? "border-b " : "") + "hover:bg-gray-100";
    classes = classes + (pinned ? " is-pin" : "");

    const mainRow = (
      <tr onClick={handleRowClick} className={classes}>
        {/* <RowSelectorCell row={row} /> */}
        {row.map((cell, j) => {
          const Cell = rowRendererList[j];
          return Cell !== null ? (
            <Cell key={`td-${index}-${j}`} data={cell} />
          ) : null;
        })}
      </tr>
    );

    const ExpandableTable = ({ embeddedDataIndex, tableName }) => {
      const handleExpandClick = () => {
        setState((state) => ({
          selectedRowIndex: state.selectedRowIndex === index ? null : index,
          selectedEmbeddedDataIndex:
            state.selectedEmbeddedDataIndex === embeddedDataIndex
              ? null
              : embeddedDataIndex,
        }));
      };

      return (
        <span
          className="inline-block bg-gray-200 px-2 rounded cursor-pointer"
          onClick={handleExpandClick}
        >
          Expand {tableName}
        </span>
      );
    };

    return (
      <Fragment>
        {mainRow}
        <tr className={`border-b ${classes}`}>
          <td colSpan={row.length + 1} className="py-1 px-4">
            {embeddedTableNames.map((x, j) => (
              <ExpandableTable
                key={`em-tb-${x}-${j}`}
                embeddedDataIndex={j}
                tableName={x}
              />
            ))}
            {index === state.selectedRowIndex &&
            state.selectedEmbeddedDataIndex !== null ? (
              <EmbeddedTable
                parentRecordIndex={index}
                embedContext={{
                  embeddedDataIndex: state.selectedEmbeddedDataIndex,
                  parentRow: row,
                }}
              />
            ) : null}
          </td>
        </tr>
      </Fragment>
    );
  };
  const pinnedRowIds = pins && pins.length > 0 ? pins.map((x) => x[2]) : null;

  const Row = embedded.length === 0 ? RowWithoutEmbed : RowWithEmbed;

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
