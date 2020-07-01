import React, { useEffect, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { getCacheKey } from "utils";
import { fetchData, toggleRowSelection } from "services/browser/actions";
import { fetchPins, fetchSavedQuerySpecification } from "services/apps/actions";
import { getPinsFromCache, getSavedQuerySpecification } from "services/apps/getters";
import { fetchSchema } from "services/schema/actions";
import rowRenderer from "./rowRenderer";
import TableHead from "./TableHead";


const SavedQueryLoader = ({ savedQueryId, fetchSavedQuerySpecification }) => {
  useEffect(() => {
    fetchSavedQuerySpecification(savedQueryId);
  }, [savedQueryId, fetchSavedQuerySpecification]);

  return (
    <div>Loading Saved Query...</div>
  )
}

const Grid = ({
  isReady, sourceId, tableName, tableColumns, tableRows, schemaColumns, history,
  querySpecificationColumns, selectedRowList, showPinnedRecords, pins, savedQueryId, savedQuery,
  fetchData, fetchSchema, toggleRowSelection, fetchPins, fetchSavedQuerySpecification
}) => {
  useEffect(() => {
    if (!!sourceId) {
      fetchSchema(sourceId);
      fetchData();
    }
    if (!!savedQuery && Object.keys(savedQuery).includes("source_id")) {
      fetchSchema(savedQuery.source_id);
      fetchData(savedQuery);
    }
  }, [sourceId, tableName, fetchSchema, fetchData, savedQuery]);
  useEffect(() => {
    if (isReady && showPinnedRecords) {
      fetchPins();
    }
  }, [isReady, showPinnedRecords, fetchPins]);

  if (!isReady) {
    if (!!savedQueryId) {
      return <SavedQueryLoader savedQueryId={savedQueryId} fetchSavedQuerySpecification={fetchSavedQuerySpecification} />
    }
    return (
      <div>Loading...</div>
    );
  }

  const rowRendererList = rowRenderer(schemaColumns, tableColumns, querySpecificationColumns);
  const RowSelectorCell = ({row}) => {
    const handleRowSelect = event => {
      event.preventDefault();
      event.stopPropagation();
      toggleRowSelection(row[0]);
    }

    const stopPropagation = event => {
      event.stopPropagation();
    }

    return (
      <td onClick={handleRowSelect}>
        <input className="checkbox" type="checkbox" onClick={stopPropagation} onChange={handleRowSelect} checked={selectedRowList.includes(row[0])} />
      </td>
    );
  }

  const Row = ({row, index, pinned = false}) => {
    const handleRowClick = event => {
      event.preventDefault();
      history.push(`/browse/${sourceId}/${tableName}/${row[0]}`);
    }

    return (
      <tr onClick={handleRowClick} className={pinned ? "is-pin" : ""}>
        <RowSelectorCell row={row} />
        {row.map((cell, j) => {
          const Cell = rowRendererList[j];
          return Cell !== null ? <Cell key={`td-${index}-${j}`} data={cell} /> : null;
        })}
      </tr>
    );
  }
  const pinnedRowIds = pins && pins.length > 0 ? pins.map(x => x[2]) : null;

  return (
    <table className="table is-narrow is-fullwidth is-hoverable is-data-table">
      <thead>
        <TableHead />
      </thead>

      <tbody>
        {pinnedRowIds && showPinnedRecords ? (
          <Fragment>
            {tableRows.filter(x => pinnedRowIds.includes(x[0])).map((row, i) => (
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
}


const mapStateToProps = (state, props) => {
  // Our Grid can be called either for a particular data source/table or from a saved query
  let {sourceId, tableName, savedQueryId} = props.match.params;
  if (!!savedQueryId) {
    // The Grid was called on a saved query, we need to find the real data source and query spec
    const appsIsReady = state.apps.isReady;
    if (!appsIsReady) {
      return {
        isReady: false,
        appsIsReady,
      };
    }

    return {
      isReady: false,
      appsIsReady,
      savedQueryId,
      savedQuery: getSavedQuerySpecification(state, savedQueryId),
    };
  }
  sourceId = parseInt(sourceId);
  const cacheKey = getCacheKey(state);
  let isReady = false;

  // We are ready only when all the needed data is there
  if (state.schema.isReady && state.schema.sourceId === parseInt(sourceId) &&
    state.browser.isReady && state.browser.cacheKey === cacheKey &&
    state.querySpecification.isReady && state.querySpecification.cacheKey === cacheKey) {
    isReady = true;
  }
  let pins = [];
  try {
    pins = getPinsFromCache(state);
  } catch (error) {
    // Do nothing for now
  }

  if (isReady) {
    return {
      isReady,
      sourceId,
      tableName,
      schemaColumns: state.schema.rows.find(x => x.table_name === tableName).columns,
      tableColumns: state.browser.columns,
      tableRows: state.browser.rows,
      selectedRowList: state.browser.selectedRowList,
      querySpecificationColumns: state.querySpecification.columnsSelected,
      showPinnedRecords: state.global.showPinnedRecords,
      pins,
    }
  } else {
    return {
      isReady,
      sourceId,
      tableName,
    };
  }
}


export default withRouter(connect(
  mapStateToProps,
  {
    fetchData,
    fetchSchema,
    toggleRowSelection,
    fetchPins,
    fetchSavedQuerySpecification,
  }
)(Grid));