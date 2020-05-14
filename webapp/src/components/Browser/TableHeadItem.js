import React from "react";
import { connect } from "react-redux";

import { toggleOrderBy } from "services/querySpecification/actions";


const TableHeadItem = ({toggleOrderBy, head, ordering}) => {
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
  return {
    ordering: state.querySpecification.orderBy[head],
  };
}


export default connect(
  mapStateToProps,
  {
    toggleOrderBy, 
  }
)(TableHeadItem);