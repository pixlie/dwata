import React, { useContext, useState } from "react";

import { QueryContext } from "utils";
import { useSchema, useQuerySpecification } from "services/store";
import { Hx } from "components/LayoutHelpers";

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

  const BoundInput = ({ tableName, column }) => {
    const columnLabel = `${tableName}.${column.name}`;
    const handleClick = () => {
      toggleColumnSelection(queryContext.key, columnLabel);
    };
    const checked = selectedColumLabels.includes(columnLabel);

    return (
      <label
        className={`block font-mono font-normal text-sm bg-gray-200 py-1 px-2 mb-1 border hover:bg-gray-300 ${
          checked ? "text-gray-700" : "text-gray-500"
        }`}
      >
        <input
          type="checkbox"
          name={columnLabel}
          checked={checked}
          onChange={handleClick}
          className="mr-1"
        />
        {column.name}
      </label>
    );
  };

  const handleTableSelect = (event) => {
    const { value } = event.target;
    setState({
      userSelectedTableName: value,
    });
  };

  return (
    <div
      className="fixed bg-white border rounded p-4 shadow-md"
      style={{ top: "4rem", right: "1rem" }}
    >
      <Hx x="4">Columns</Hx>

      <p className="text-gray-700 my-2">
        For any selected table, you can choose which columns you want to see.
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

      {currentTable.columns.map((col) => (
        <BoundInput
          key={`sel-${currentTable.table_name}-${col.name}`}
          tableName={currentTable.table_name}
          column={col}
        />
      ))}
    </div>
  );
};
