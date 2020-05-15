import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import TableHeadItem from "./TableHeadItem";


const TableHead = ({isReady, schemaColumns, tableColumns, querySpecificationColumns}) => {
  const headList = [];
  const DefaultCell = ({data}) => <TableHeadItem head={data} />;

  if (!isReady) {
    return null;
  }

  for (const col of tableColumns) {
    if (!querySpecificationColumns.includes(col)) {
      continue;
    }
    const head = schemaColumns.find(x => x.name === col);
    if (head.is_primary_key) {
      headList.push(<DefaultCell data={col} key={`th-${col}`} />);
    } else {
      headList.push(<DefaultCell data={col} key={`th-${col}`} />);
    }
  }

  return (
    <tr>
      {headList}
    </tr>
  );
}


const mapStateToProps = (state, props) => {
  let { sourceId, tableName } = props.match.params;
  sourceId = parseInt(sourceId);
  const _browserCacheKey = `${sourceId}/${tableName}`;
  let isReady = false;
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
      querySpecificationColumns: state.querySpecification.columnsSelected,
    };
  } else {
    return {
      isReady,
    };
  }
}


export default withRouter(connect(
  mapStateToProps,
  {}
)(TableHead));