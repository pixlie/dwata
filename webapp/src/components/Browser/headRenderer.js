import React from "react";


export default (schema, queriedColumns) => {
  const headList = [];
  const DefaultCell = ({ data }) => <th>{data}</th>;

  for (let i = 0; i < queriedColumns.length; i++) {
    const head = schema.columns.find(x => x.name === queriedColumns[i]);
    if (head.has_foreign_keys) {
      headList.push(null);
    } else {
      headList.push(DefaultCell);
    }
  }

  return headList;
}