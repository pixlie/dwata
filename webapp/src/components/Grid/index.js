import React, { useEffect, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { withQueryDetails } from "utils";
import { toggleRowSelection } from "services/browser/actions";
import { fetchPins } from "services/apps/actions";
import { getPinsFromCache } from "services/apps/getters";
import { getQueryDetails } from "services/browser/getters";
import rowRenderer from "./rowRenderer";
import TableHead from "./TableHead";
import QueryLoader from "./QueryLoader";
import SavedQueryLoader from "./SavedQueryLoader";

const Grid = ({
  isReady,
  sourceId,
  tableName,
  tableColumns,
  tableRows,
  schemaColumns,
  history,
  querySpecificationColumns,
  selectedRowList,
  showPinnedRecords,
  pins,
  savedQueryId,
  toggleRowSelection,
  fetchPins,
}) => {
  useEffect(() => {
    if (isReady && showPinnedRecords) {
      fetchPins();
    }
  }, [isReady, showPinnedRecords, fetchPins]);

  if (!isReady) {
    if (!!savedQueryId) {
      return <SavedQueryLoader />;
    }
    return <QueryLoader />;
  }

  const rowRendererList = rowRenderer(
    schemaColumns,
    tableColumns,
    querySpecificationColumns
  );
  const RowSelectorCell = ({ row }) => {
    const handleRowSelect = (event) => {
      event.preventDefault();
      event.stopPropagation();
      toggleRowSelection(row[0]);
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
      history.push(`/browse/${sourceId}/${tableName}/${row[0]}`);
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
    <table className="table is-narrow is-fullwidth is-hoverable is-data-table">
      <thead>
        <TableHead />
      </thead>

      <tbody>
        {pinnedRowIds && showPinnedRecords ? (
          <Fragment>
            {tableRows
              .filter((x) => pinnedRowIds.includes(x[0]))
              .map((row, i) => (
                <Row key={`tr-${i}`} row={row} index={i} pinned />
              ))}
          </Fragment>
        ) : null}
        {tableRows.map((row, i) => (
          <Row key={`tr-${i}`} row={row} index={i} />
        ))}
      </tbody>
    </table>
  );
};

const mapStateToProps = (state, props) => {
  const { cacheKey, sourceId, tableName, savedQueryId } = getQueryDetails(
    state,
    props
  );

  // We are ready only when all the needed data is there
  if (
    cacheKey &&
    state.schema.isReady &&
    state.schema.sourceId === sourceId &&
    state.browser.isReady &&
    state.browser.cacheKey === cacheKey &&
    state.querySpecification.isReady &&
    state.querySpecification.cacheKey === cacheKey
  ) {
    let pins = [];
    try {
      pins = getPinsFromCache(state);
    } catch (error) {
      // Do nothing for now
    }
    return {
      isReady: true,
      savedQueryId,
      sourceId,
      tableName,
      schemaColumns: state.schema.rows.find((x) => x.table_name === tableName)
        .columns,
      tableColumns: state.browser.columns,
      tableRows: state.browser.rows,
      selectedRowList: state.browser.selectedRowList,
      querySpecificationColumns: state.querySpecification.columnsSelected,
      showPinnedRecords: state.global.showPinnedRecords,
      pins,
    };
  }

  return {
    isReady: false,
    savedQueryId,
  };
};

export default withRouter(
  withQueryDetails(
    connect(mapStateToProps, {
      toggleRowSelection,
      fetchPins,
    })(Grid)
  )
);