import React, { Fragment, useState, useContext } from "react";

import { QueryContext } from "utils";
import {
  useGlobal,
  useSchema,
  useData,
  useQuerySpecification,
} from "services/store";
import { saveQuery } from "services/apps/actions";
import { Section, Hx } from "components/LayoutHelpers";
import FilterItem from "./FilterItem";

export default () => {
  const queryContext = useContext(QueryContext);
  const data = useData((state) => state[queryContext.key]);
  const isFEVisible = useGlobal((state) => state.isFEVisible);
  const querySpecification = useQuerySpecification(
    (state) => state[queryContext.key]
  );
  const schema = useSchema((state) => state[querySpecification.sourceLabel]);
  const initiateFilter = useQuerySpecification((state) => state.initiateFilter);
  const removeFilter = useQuerySpecification((state) => state.removeFilter);
  const [state, setState] = useState({
    isSavingQuery: false,
    savedQueryLabel: "",
  });

  if (
    !(
      data &&
      data.isReady &&
      isFEVisible &&
      querySpecification &&
      querySpecification.isReady
    )
  ) {
    return null;
  }

  const { filterBy } = querySpecification;
  const schemaColumns = schema.rows.find(
    (x) => x.table_name === querySpecification.tableName
  ).columns;

  const addFilter = (event) => {
    event.preventDefault();
    const { value } = event.target;
    if (value === "") {
      return;
    }
    const dataType = schemaColumns.find((x) => x.name === value);
    initiateFilter(queryContext.key, value, dataType);
  };

  const handleRemoveFilter = (name) => (event) => {
    event.preventDefault();
    if (name in filterBy) {
      removeFilter(queryContext.key, name);
    }
  };

  const filters = [];
  if (Object.keys(filterBy).length > 0) {
    filters.push(
      <p className="tip" key="fl-rm-hd">
        Double click column name to remove filter
      </p>
    );
  }

  for (const [columnName] of Object.entries(filterBy)) {
    filters.push(
      <div key={`fl-${columnName}`} className="field is-horizontal">
        <div className="field-label">
          <label
            className="label"
            onDoubleClick={handleRemoveFilter(columnName)}
          >
            {columnName}
          </label>
        </div>

        <div className="field-body">
          <FilterItem key={`fl-${columnName}`} columnName={columnName} />
        </div>
      </div>
    );
  }

  const filterByOptions = [
    <option value="---" key="fl-hd">
      Filter by
    </option>,
  ];
  for (const head of schemaColumns) {
    filterByOptions.push(
      <option value={head.name} key={`fl-${head.name}`}>
        {head.name}
      </option>
    );
  }

  const handleSaveQuery = async () => {
    if (state.isSavingQuery) {
      await saveQuery(state.savedQueryLabel, querySpecification);
    } else {
      setState((state) => ({
        ...state,
        isSavingQuery: true,
      }));
    }
  };

  const cancelSaveQuery = (event) => {
    setState((state) => ({
      ...state,
      isSavingQuery: false,
    }));
  };

  const handleSavedFilterLabelChange = (event) => {
    const { value } = event.target;
    setState((state) => ({
      ...state,
      savedQueryLabel: value,
    }));
  };

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
              <input
                className="input"
                onChange={handleSavedFilterLabelChange}
                value={state.savedQueryLabel}
                placeholder="Label for this Query"
              />
            </div>
          </div>
        ) : null}

        <div className="buttons">
          {state.isSavingQuery ? (
            <Fragment>
              <button className="button is-success" onClick={handleSaveQuery}>
                Save Query
              </button>
              <button className="button is-white" onClick={cancelSaveQuery}>
                Cancel
              </button>
            </Fragment>
          ) : (
            <Fragment>
              <button className="button is-success" onClick={handleSaveQuery}>
                Save Query
              </button>
              <button className="button is-success" onClick={() => {}}>
                Start funnel
              </button>
            </Fragment>
          )}
        </div>
      </Section>
    </div>
  );
};
