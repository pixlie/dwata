import React, { Fragment, useContext, useState } from "react";

import { QueryContext, tableColorWhiteOnMedium } from "utils";
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
  const tableColors = querySpecification.tableColors;

  const addFilter = (event) => {
    event.preventDefault();
    const { value } = event.target;
    if (value === "") {
      return;
    }
    const dataType = getColumnSchema(schema.rows, value);
    initiateFilter(queryContext.key, value, dataType);
  };

  const TableItem = ({ tableName }) => {
    const handleTableSelect = () => {
      setState({
        userSelectedTableName: tableName,
      });
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
        <p className="text-sm px-4 text-gray-700" key="fl-rm-hd">
          Double click column name to remove filter
        </p>
      );
    }

    for (const [columnName] of Object.entries(filterBy)) {
      const [tn, cn] = columnName.split(".");

      filters.push(
        <div key={`fl-${columnName}`} className="my-2 ml-6">
          <label
            className="text-sm mr-2"
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
      <div className="bg-gray-100 mb-2">
        <div
          key={`opt-${tableName}`}
          className={`w-full px-2 ${tableColorWhiteOnMedium(
            tableColors[tableName]
          )} cursor-pointer rounded rounded-b-none`}
          onClick={handleTableSelect}
        >
          <span className="text-lg text-white ml-2 mr-3">
            <i className="fas fa-table" />
          </span>
          <span className="inline-block font-bold text-white">{tableName}</span>
        </div>

        {currentTable.table_name === tableName ? (
          <Fragment>
            {filters}

            <div className="mx-6 my-2">
              <select
                className="w-full pl-1 py-1 mb-2 bg-white border rounded"
                onChange={addFilter}
                value="---"
              >
                {filterByOptions}
              </select>
            </div>
          </Fragment>
        ) : null}
      </div>
    );
  };

  return (
    <div
      className="fixed bg-white border rounded p-4 shadow-md"
      style={{ top: "4rem", right: "1rem" }}
    >
      <Hx x="4">Filters</Hx>

      <p className="text-sm text-gray-700 my-2 max-w-xs">
        You can filter by any column, even the ones that are not visible in the
        grid.
      </p>

      {selectedTables.map((x) => (
        <TableItem key={`fl-tbl-${x.table_name}`} tableName={x.table_name} />
      ))}
    </div>
  );
};
