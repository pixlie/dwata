import React, { Fragment, useState, useContext } from "react";

import { QueryContext } from "utils";
import { useSchema, useQuerySpecification } from "services/store";
import { getColumnSchema } from "services/querySpecification/getters";
import { Hx } from "components/LayoutHelpers";
import FilterItem from "./FilterItem";

export default () => {
  const queryContext = useContext(QueryContext);
  const querySpecification = useQuerySpecification(
    (state) => state[queryContext.key]
  );
  const schema = useSchema((state) => state[querySpecification.sourceLabel]);
  const initiateFilter = useQuerySpecification((state) => state.initiateFilter);
  const removeFilter = useQuerySpecification((state) => state.removeFilter);

  const { filterBy } = querySpecification;

  const addFilter = (event) => {
    event.preventDefault();
    const { value } = event.target;
    if (value === "") {
      return;
    }
    const dataType = getColumnSchema(schema.rows, value);
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
  for (const head of querySpecification.select) {
    filterByOptions.push(
      <option value={head.name} key={`fl-${head.name}`}>
        {head.name}
      </option>
    );
  }

  return (
    <Fragment>
      <Hx x="5">Filters</Hx>

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
    </Fragment>
  );
};
