import React, { useContext, useState } from "react";

import { QueryContext, tableColorWhiteOnMedium } from "utils";
import { useSchema, useQuerySpecification } from "services/store";

export default () => {
  const [state, setState] = useState({
    userSelectedTableName: null,
  });

  const queryContext = useContext(QueryContext);
  const querySpecification = useQuerySpecification(
    (state) => state[queryContext.key]
  );
  const toggleColumnSelection = useQuerySpecification(
    (state) => state.toggleColumnSelection
  );
  const schema = useSchema((state) => state[querySpecification.sourceLabel]);
  const selectedColumLabels = querySpecification.columns.map((x) => x.label);
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

  const BoundInput = ({ tableName, column }) => {
    const columnLabel = `${tableName}.${column.name}`;
    const handleClick = () => {
      toggleColumnSelection(queryContext.key, columnLabel);
    };
    const checked = selectedColumLabels.includes(columnLabel);

    return (
      <div className="border-b hover:bg-gray-200">
        <input
          className="inline-block ml-4"
          type="checkbox"
          name={columnLabel}
          checked={checked}
          onChange={handleClick}
          id={`col-sl-${tableName}.${column.name}`}
        />
        <label
          className={`inline-block font-medium text-sm leading-loose ml-4 ${
            checked ? "text-gray-600" : "text-gray-500"
          }`}
          htmlFor={`col-sl-${tableName}.${column.name}`}
        >
          {column.name}
        </label>
      </div>
    );
  };

  const TableItem = ({ tableName }) => {
    const handleTableSelect = () => {
      setState({
        userSelectedTableName: tableName,
      });
    };

    return (
      <div>
        <div
          key={`opt-${tableName}`}
          className={`w-full px-2 ${tableColorWhiteOnMedium(
            tableColors[tableName]
          )} cursor-pointer`}
          onClick={handleTableSelect}
        >
          <span className="text-lg text-white ml-2 mr-3">
            <i className="fas fa-table" />
          </span>
          <span className="inline-block font-semibold text-white">
            {tableName}
          </span>
        </div>

        {currentTable.table_name === tableName
          ? currentTable.columns.map((col) => (
              <BoundInput
                key={`sel-${currentTable.table_name}-${col.name}`}
                tableName={currentTable.table_name}
                column={col}
              />
            ))
          : null}
      </div>
    );
  };

  return (
    <div
      className="fixed bg-white border rounded shadow-md w-64"
      style={{ top: "4rem", right: "1rem" }}
    >
      {selectedTables.map((x) => (
        <TableItem key={`col-tbl-${x.table_name}`} tableName={x.table_name} />
      ))}
    </div>
  );
};
