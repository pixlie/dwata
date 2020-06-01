import React from 'react';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { fetchData } from "services/browser/actions";
import { initiateFilter, removeFilter } from "services/querySpecification/actions";
import { Section, Hx } from "components/BulmaHelpers";
import FilterItem from "./FilterItem";


const FilterEditor = ({isReady, isVisible, schemaColumns, filterBy, initiateFilter, removeFilter, fetchData}) => {
  if (!isReady || !isVisible) {
    return null;
  }

  const addFilter = event => {
    event.preventDefault();
    const {value} = event.target;
    if (value === "") {
      return;
    }
    const dataType = schemaColumns.find(x => x.name === value);
    initiateFilter(value, dataType);
  }

  const handleRemoveFilter = name => event => {
    event.preventDefault();
    if (name in filterBy) {
      removeFilter(name);
    }
  }

  const filters = [];
  if (Object.keys(filterBy).length > 0) {
    filters.push(
      <p className="tip" key="fl-rm-hd">Double click column name to remove filter</p>
    );
  }

  for (const [columnName] of Object.entries(filterBy)) {
    filters.push(
      <div key={`fl-${columnName}`} className="field is-horizontal">
        <div className="field-label">
          <label className="label" onDoubleClick={handleRemoveFilter(columnName)}>{columnName}</label>
        </div>

        <div className="field-body">
          <FilterItem key={`fl-${columnName}`} columnName={columnName} />
        </div>
      </div>
    );
  }

  const filterByOptions = [<option value="---" key="fl-hd">Filter by</option>];
  for (const head of schemaColumns) {
    filterByOptions.push(<option value={head.name} key={`fl-${head.name}`}>{head.name}</option>);
  }

  const handleSubmit = event => {
    event.preventDefault();
    fetchData();
  };

  return (
    <div id="filter-editor">
      <Section>
        <Hx x="6">Filters</Hx>

        {filters}

        <div className="field">
          <div className="control">
            <div className="select is-fullwidth">
              <select name="filter_column" onChange={addFilter} value="---">
                {filterByOptions}
              </select>
            </div>
          </div>
        </div>

        <button className="button is-fullwidth is-success" onClick={handleSubmit}>Apply</button>
      </Section>
    </div>
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
      filterBy: state.querySpecification.filterBy,
      isVisible: state.global.isFEVisible,
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
    initiateFilter,
    removeFilter,
    fetchData,
  }
)(FilterEditor));