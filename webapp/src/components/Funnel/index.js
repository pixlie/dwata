import React, { useEffect } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { getCacheKey } from "utils";
import { fetchData, toggleRowSelection } from "services/browser/actions";
import { fetchPins } from "services/apps/actions";
import { getPinsFromCache } from "services/apps/getters";
import { fetchSchema } from "services/schema/actions";
import { Hx } from "components/BulmaHelpers";
import rowRenderer from "./rowRenderer";


const Kanban = ({
  isReady, sourceId, tableName, tableColumns, tableRows, schemaColumns, history,
  querySpecificationColumns, selectedRowList, showPinnedRecords, pins,
  fetchData, fetchSchema, toggleRowSelection, fetchPins,
}) => {
  useEffect(() => {
    fetchSchema(sourceId);
    fetchData();
  }, [sourceId, tableName, fetchSchema, fetchData]);
  useEffect(() => {
    if (isReady && showPinnedRecords) {
      fetchPins();
    }
  }, [isReady, showPinnedRecords, fetchPins]);

  if (!isReady) {
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
      <span onClick={handleRowSelect}>
        <input className="checkbox" type="checkbox" onClick={stopPropagation} onChange={handleRowSelect} checked={selectedRowList.includes(row[0])} />
      </span>
    );
  }

  const Row = ({row, index, pinned = false}) => {
    const handleRowClick = event => {
      event.preventDefault();
      history.push(`/browse/${sourceId}/${tableName}/${row[0]}`);
    }

    return (
      <div onClick={handleRowClick} className={`box ${pinned ? "is-pin" : ""}`}>
        <RowSelectorCell row={row} />
        {row.map((cell, j) => {
          const Cell = rowRendererList[j];
          return Cell !== null ? <Cell key={`td-${index}-${j}`} data={cell} /> : null;
        })}
      </div>
    );
  }
  // const pinnedRowIds = pins && pins.length > 0 ? pins.map(x => x[2]) : null;

  return (
    <div className="container">
      <p>&nbsp;</p>

      <div className="columns">
        <div className="column is-4">
          <div className="content has-text-centered">
            <Hx x="4">New users this week</Hx>
          </div>
          {tableRows.map((row, i) => (
            <Row key={`tr-${i}`} row={row} index={i} />
          ))}
        </div>

        <div className="column is-4">
          <div className="content has-text-centered">
            <Hx x="4">Activated users</Hx>
          </div>
          {tableRows.filter(row => row[5] === true).map((row, i) => (
            <Row key={`tr-${i}`} row={row} index={i} />
          ))}
        </div>

        <div className="column is-4">
          <div className="content has-text-centered">
            <Hx x="4">Bio added</Hx>
          </div>
          {tableRows.filter(row => !!row[10] && row[10].length > 10).map((row, i) => (
            <Row key={`tr-${i}`} row={row} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}


const mapStateToProps = (state, props) => {
  let {sourceId, tableName} = props.match.params;
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
  }
)(Kanban));