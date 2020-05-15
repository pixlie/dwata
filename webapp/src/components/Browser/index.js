import React, { useEffect } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { fetchData } from "services/browser/actions";
import { fetchSchema } from "services/schema/actions";
import rowRenderer from "./rowRenderer";
import TableHead from "./TableHead";


const Browser = ({
  isReady, sourceId, tableName, tableColumns, tableRows, schemaColumns, history,
  querySpecificationColumns, fetchData, fetchSchema
}) => {
  useEffect(() => {
    fetchSchema(sourceId);
    fetchData();
  }, [sourceId, tableName]);
  if (!isReady) {
    return (
      <div>Loading...</div>
    );
  }

  const rowRendererList = rowRenderer(schemaColumns, tableColumns, querySpecificationColumns);

  return (
    <table className="table is-narrow is-fullwidth is-hoverable is-data-table">
      <thead>
        <TableHead />
      </thead>

      <tbody>
        {tableRows.map((row, i) => (
          <tr key={`tr-${i}`} onClick={() => {history.push(`/browse/${sourceId}/${tableName}/${row[0]}`)}}>
            {row.map((cell, j) => {
              const Cell = rowRendererList[j];
              return Cell !== null ? <Cell key={`td-${i}-${j}`} data={cell} /> : null;
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}


const mapStateToProps = (state, props) => {
  let {sourceId, tableName} = props.match.params;
  sourceId = parseInt(sourceId);
  const _browserCacheKey = `${sourceId}/${tableName}`;
  let isReady = false;

  console.log(state.schema.isReady, state.schema.sourceId === parseInt(sourceId),
  state.browser.isReady, state.browser._cacheKey === _browserCacheKey,
  state.querySpecification.isReady, state.querySpecification._cacheKey === _browserCacheKey,
  state.querySpecification._cacheKey, _browserCacheKey);

  if (state.schema.isReady && state.schema.sourceId === parseInt(sourceId) &&
    state.browser.isReady && state.browser._cacheKey === _browserCacheKey &&
    state.querySpecification.isReady && state.querySpecification._cacheKey === _browserCacheKey) {
    isReady = true;
  }

  if (isReady) {
    return {
      isReady,
      sourceId,
      tableName,
      schemaColumns: state.schema.rows.find(x => x.table_name === tableName).columns,
      tableColumns: state.browser.columns,
      tableRows: state.browser.rows,
      querySpecificationColumns: state.querySpecification.columnsSelected,
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
  }
)(Browser));