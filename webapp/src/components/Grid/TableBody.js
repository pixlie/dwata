import React, { useState, useContext, Fragment } from "react";

import { QueryContext } from "utils";
import { useData, useQuerySpecification } from "services/store";
import ProductGuide from "components/ProductGuide";
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

  // useEffect(() => {
  //   if (isReady && showPinnedRecords) {
  //     fetchPins();
  //   }
  // }, [isReady, showPinnedRecords, fetchPins]);
  let rows = null,
    embedded = null,
    pins = [],
    showPinnedRecords = false;
  if (data) {
    ({ rows, embedded } = data);
  }
  const embeddedTableNames = [
    ...new Set(
      querySpecification.embeddedColumns
        .reduce((acc, x) => [...acc, ...x], [])
        .map((x) => x.tableName)
    ),
  ];

  const rowRendererList = rowRenderer();

  const RowWithoutEmbed = ({ row, index, pinned = false }) => {
    // This is a normal grid row that does not show embedded grid inside it.
    let classes = "hover:bg-gray-100";
    classes = classes + (pinned ? " is-pin" : "");

    const rowList = [];
    for (const j in rowRendererList) {
      const [cellIndex, Cell] = rowRendererList[j];
      if (cellIndex === null) {
        rowList.push(<Cell key={`td-${index}-${j}`} row={row} />);
      } else {
        rowList.push(
          <Cell key={`td-${index}-${j}`} data={row[cellIndex]} row={row} />
        );
      }
    }

    return <tr className={classes}>{rowList}</tr>;
  };

  const RowWithEmbed = ({ row, index, pinned = false }) => {
    // This is a grid row that expands the merged (embedded) data that is related to this row.
    let classes = "hover:bg-gray-100";
    classes = classes + (pinned ? " is-pin" : "");

    const rowList = [];
    for (const j in rowRendererList) {
      const [cellIndex, Cell] = rowRendererList[j];
      if (Cell === null) {
        rowList.push(null);
      }
      if (cellIndex === null) {
        rowList.push(<Cell key={`td-${index}-${j}`} row={row} />);
      } else {
        rowList.push(
          <Cell key={`td-${index}-${j}`} data={row[cellIndex]} row={row} />
        );
      }
    }

    const mainRow = <tr className={classes}>{rowList}</tr>;

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

      if (
        state.selectedRowIndex === index &&
        state.selectedEmbeddedDataIndex === embeddedDataIndex
      ) {
        return (
          <span
            className="inline-block bg-gray-700 text-white px-2 mr-2 rounded cursor-pointer"
            onClick={handleExpandClick}
          >
            Collapse {tableName}
          </span>
        );
      } else {
        return (
          <Fragment>
            <span
              className="inline-block bg-gray-200 hover:bg-gray-400 px-2 mr-2 rounded cursor-pointer"
              onClick={handleExpandClick}
            >
              Expand {tableName}
            </span>
            {index === 0 ? (
              <span className="relative">
                <ProductGuide guideFor="expandButton" />
              </span>
            ) : null}
          </Fragment>
        );
      }
    };

    return (
      <Fragment>
        {mainRow}
        <tr>
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
