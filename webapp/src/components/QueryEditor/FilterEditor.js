import React, { Fragment, useContext, useState } from "react";

import { QueryContext } from "utils";
import { useSchema, useQuerySpecification } from "services/store";
import { getColumnSchema } from "services/querySpecification/getters";
import { Hx } from "components/LayoutHelpers";
import FilterItem from "./FilterItem";

export default () => {
  const [state, setState] = useState({
    userSelectedTableName: null,
  });

  const queryContext = useContext(QueryContext);
  const querySpecification = useQuerySpecification(
    (state) => state[queryContext.key]
  );
  const schema = useSchema((state) => state[querySpecification.sourceLabel]);
  const initiateFilter = useQuerySpecification((state) => state.initiateFilter);
  const removeFilter = useQuerySpecification((state) => state.removeFilter);

  const { filterBy } = querySpecification;
  const selectedTableNames = [
    ...new Set(querySpecification.columns.map((x) => x.tableName)),
  ];
  const selectedTables = selectedTableNames.map((x) =>
    schema.rows.find((y) => y.table_name === x)
  );
  const currentTable = state.userSelectedTableName
    ? selectedTables.find((x) => x.table_name === state.userSelectedTableName)
    : selectedTables[0];

  const addFilter = (event) => {
    event.preventDefault();
    const { value } = event.target;
    if (value === "") {
      return;
    }
    const dataType = getColumnSchema(schema.rows, value);
    initiateFilter(queryContext.key, value, dataType);
  };

  const handleTableSelect = (event) => {
    const { value } = event.target;
    setState({
      userSelectedTableName: value,
    });
  };

  const PerTable = () => {
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
      const [tn, cn] = columnName.split(".");

      filters.push(
        <div key={`fl-${columnName}`} className="my-2">
          <label
            className="font-bold mr-2"
            onDoubleClick={handleRemoveFilter(columnName)}
          >
            {cn}
          </label>

          <FilterItem columnName={columnName} />
        </div>
      );
    }

    const filterByOptions = [
      <option value="---" key="fl-hd">
        Add a filter
      </option>,
    ];
    for (const col of currentTable.columns) {
      filterByOptions.push(
        <option
          value={`${currentTable.table_name}.${col.name}`}
          key={`fl-${col.name}`}
        >
          {col.name}
        </option>
      );
    }

    return (
      <Fragment>
        {filters}

        <select
          className="w-full pl-4 py-2 mb-2 bg-white border rounded font-bold text-lg shadow-md"
          onChange={addFilter}
          value="---"
        >
          {filterByOptions}
        </select>
      </Fragment>
    );
  };

  return (
    <div
      className="fixed bg-white border rounded p-4 shadow-md"
      style={{ top: "4rem", right: "1rem" }}
    >
      <Hx x="4">Filters</Hx>

      <p className="text-gray-700 my-2">
        You can filter by any column, even the ones that are not visible.
      </p>

      {selectedTables.length > 1 ? (
        <select
          className="w-full pl-4 py-2 mb-2 bg-white border rounded font-bold text-lg shadow-md"
          onChange={handleTableSelect}
        >
          {selectedTables.map((x) => (
            <option
              key={`opt-${x.table_name}`}
              className="py-2 bg-white font-bold"
              value={x.table_name}
            >
              {x.table_name}
            </option>
          ))}
        </select>
      ) : null}

      <PerTable />
    </div>
  );
};
