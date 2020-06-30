import React, { Fragment, useState } from 'react';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { getCacheKey } from "utils";
import { fetchData } from "services/browser/actions";
import { saveQuerySpecification } from "services/apps/actions";
import { initiateFilter, removeFilter } from "services/querySpecification/actions";
import { Section, Hx } from "components/BulmaHelpers";
import FilterItem from "./FilterItem";


const FilterEditor = ({
  isReady, isVisible, schemaColumns, filterBy, initiateFilter, removeFilter, fetchData,
  saveQuerySpecification
}) => {
  const [state, setState] = useState({
    isSavingQuery: false,
    savedQueryLabel: "",
  });

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

  const handleSaveQuery = event => {
    if (state.isSavingQuery) {
      saveQuerySpecification(state.savedQueryLabel);
    } else {
      setState(state => ({
        ...state,
        isSavingQuery: true,
      }));
    }
  }

  const cancelSaveQuery = event => {
    setState(state => ({
      ...state,
      isSavingQuery: false,
    }));
  }

  const handleSavedFilterLabelChange = event => {
    const { value } = event.target;
    setState(state => ({
      ...state,
      savedQueryLabel: value,
    }));
  }

  return (
    <div id="filter-editor">
      <Section>
        <Hx x="4">Filters</Hx>

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

        {state.isSavingQuery ? (
          <div className="field">
            <div className="control">
              <input className="input" onChange={handleSavedFilterLabelChange} value={state.savedQueryLabel} placeholder="Label for this Query" />
            </div>
          </div>
        ) : null}

        <div className="buttons">
          {state.isSavingQuery ? (
            <Fragment>
              <button className="button is-success" onClick={handleSaveQuery}>Save Query</button>
              <button className="button is-white" onClick={cancelSaveQuery}>Cancel</button>
            </Fragment>
          ) : (
            <Fragment>
              <button className="button is-success" onClick={handleSubmit}>Apply</button>
              <button className="button is-success" onClick={handleSaveQuery}>Save Query</button>
              <button className="button is-success" onClick={() => {}}>Start funnel</button>
            </Fragment>
          )}
        </div>
      </Section>
    </div>
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
    saveQuerySpecification,
  }
)(FilterEditor));