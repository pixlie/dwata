import React from "react";


const HeadItem = ({ toggleOrderBy, head }) => {
  const handleClick = event => {
    event.preventDefault();
    toggleOrderBy(head);
  }

  return (
    <th onClick={handleClick}>{head}</th>
  );
}


export default (schema, queriedColumns) => {
  const headList = [];
  const DefaultCell = ({ data }) => <th>{data}</th>;

  for (let i = 0; i < queriedColumns.length; i++) {
    const head = schema.columns.find(x => x.name === queriedColumns[i]);
    if (head.is_primary_key) {
      headList.push(DefaultCell);
    } else if (head.has_foreign_keys) {
      headList.push(null);
    } else if (head.ui_hints.includes("is_meta")) {
      headList.push(null);
    } else if (head.type === "JSONB" || head.type === "JSON") {
      headList.push(null);
    } else {
      headList.push(DefaultCell);
    }
  }

  return headList;
}