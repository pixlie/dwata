import React from "react";
import { connect } from "react-redux";

import { toggleOrderBy } from "services/querySpecification/actions";


const HeadItem = ({ toggleOrderBy, head, ordering }) => {
  const handleClick = event => {
    event.preventDefault();
    toggleOrderBy(head);
  }
  if (ordering === "asc") {
    return (
      <th onClick={handleClick}>
        <i className="fas fa-sort-up" />&nbsp;{head}
      </th>
    );
  } else if (ordering === "desc") {
    return (
      <th onClick={handleClick}>
        <i className="fas fa-sort-down" />{head}
      </th>
    );
  } else {
    return (
      <th onClick={handleClick}>{head}</th>
    );
  }
}


const mapStateToProps = (state, {head}) => {
  const qs = state.querySpecification;

  return {
    ordering: qs.orderBy[head],
  };
}


const HeadItemConnected = connect(
  mapStateToProps,
  {
    toggleOrderBy, 
  }
)(HeadItem);


export default (schema, queriedColumns) => {
  const headList = [];
  const DefaultCell = ({ data }) => <HeadItemConnected head={data} />;

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