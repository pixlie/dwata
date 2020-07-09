import React from "react";

import { getCacheKey } from "utils";
import { getQueryDetails } from "services/browser/getters";
import { getSavedQuery } from "services/apps/getters";
import TableHeadItem from "./TableHeadItem";

export default ({
  isReady,
  schemaColumns,
  tableColumns,
  querySpecificationColumns,
}) => {
  if (!isReady) {
    return null;
  }
  const headList = [];
  const DefaultCell = ({ data }) => <TableHeadItem head={data} />;

  for (const col of tableColumns) {
    if (!querySpecificationColumns.includes(col)) {
      continue;
    }
    const head = schemaColumns.find((x) => x.name === col);
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
};

/*
const mapStateToProps = (state, props) => {
  const { cacheKey, sourceId, tableName } = getQueryDetails(state, props);

  if (
    state.schema.isReady &&
    state.schema.sourceId === sourceId &&
    state.browser.isReady &&
    state.browser.cacheKey === cacheKey &&
    state.querySpecification.isReady &&
    state.querySpecification.cacheKey === cacheKey
  ) {
    return {
      isReady: true,
      sourceId,
      tableName,
      schemaColumns: state.schema.rows.find((x) => x.table_name === tableName)
        .columns,
      tableColumns: state.browser.columns,
      querySpecificationColumns: state.querySpecification.columnsSelected,
    };
  }

  return {
    isReady: false,
  };
};

export default withRouter(connect(mapStateToProps, {})(TableHead));
*/
