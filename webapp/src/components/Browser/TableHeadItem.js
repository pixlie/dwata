import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { fetchData } from "services/browser/actions";
import { toggleOrderBy, initiateFilter } from "services/querySpecification/actions";
import { toggleColumnHeadSpecification } from "services/global/actions";
import FilterItem from "./FilterItem";


const ColumnHeadSpecification = ({toggleOrderBy, head, fetchData}) => {
  const handleClick = event => {
    event.preventDefault();
    toggleOrderBy(head);
  }

  const handleSubmit = event => {
    event.preventDefault();
    fetchData();
  };

  return (
    <div className="col-hd-spec-box">
      <div className="field is-grouped">
        <div className="control">
          <button className="button is-white" onClick={handleClick}><i className="fas fa-sort" /></button>
        </div>
        <FilterItem columnName={head} />
        <div className="control">
          <button className="button is-success" onClick={handleSubmit}>Apply</button>
        </div>
      </div>
    </div>
  )
};


const TableHeadItem = ({
  isReady, head, ordering, activeColumnHeadSpecification, schemaColumns,
  toggleOrderBy, toggleColumnHeadSpecification, initiateFilter, fetchData
}) => {
  if (!isReady) {
    return null;
  }
  const handleClick = event => {
    event.preventDefault();
    toggleColumnHeadSpecification(head);
    const dataType = schemaColumns.find(x => x.name === head);
    initiateFilter(head, dataType);
  }

  if (ordering === "asc") {
    return (
      <th>
        <span className="hd-btn has-dropdown hdicn icn-asc" onClick={handleClick}>
          {head}
        </span>
        {activeColumnHeadSpecification === head ? <ColumnHeadSpecification toggleOrderBy={toggleOrderBy} head={head} fetchData={fetchData} /> : null}
      </th>
    );
  } else if (ordering === "desc") {
    return (
      <th>
        <span className="hd-btn has-dropdown hdicn icn-desc" onClick={handleClick}>
          {head}
        </span>
        {activeColumnHeadSpecification === head ? <ColumnHeadSpecification toggleOrderBy={toggleOrderBy} head={head} fetchData={fetchData} /> : null}
      </th>
    );
  } else {
    return (
      <th>
        <span className="hd-btn has-dropdown" onClick={handleClick}>{head}</span>
        {activeColumnHeadSpecification === head ? <ColumnHeadSpecification toggleOrderBy={toggleOrderBy} head={head} fetchData={fetchData} /> : null}
      </th>
    );
  }
}


const mapStateToProps = (state, props) => {
  const {sourceId, tableName} = props.match.params;
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
      ordering: state.querySpecification.orderBy[props.head],
      activeColumnHeadSpecification: state.global.activeColumnHeadSpecification,
      schemaColumns: state.schema.rows.find(x => x.table_name === tableName).columns,
    };
  } else {
    return {
      isReady,
    };
  }
}


export default withRouter(connect(
  mapStateToProps,
  {
    toggleOrderBy,
    initiateFilter,
    toggleColumnHeadSpecification,
    fetchData,
  }
)(TableHeadItem));