import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { getCacheKey } from "utils";
import TableHeadItem from "./TableHeadItem";


const TableHead = ({isReady, schemaColumns, tableColumns, querySpecificationColumns}) => {
  if (!isReady) {
    return null;
  }
  const headList = [];
  const DefaultCell = ({data}) => <TableHeadItem head={data} />;

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
      <th>&nbsp;</th>
      {headList}
    </tr>
  );
}


const mapStateToProps = (state, props) => {
  let { sourceId, tableName } = props.match.params;
  sourceId = parseInt(sourceId);
  const cacheKey = getCacheKey(state);
  let isReady = false;

  if (state.schema.isReady && state.schema.sourceId === sourceId &&
    state.browser.isReady && state.browser.cacheKey === cacheKey &&
    state.querySpecification.isReady && state.querySpecification.cacheKey === cacheKey) {
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