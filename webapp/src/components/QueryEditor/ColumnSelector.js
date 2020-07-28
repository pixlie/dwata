import React, { Fragment, useContext } from "react";

import { QueryContext } from "utils";
import { useSchema, useQuerySpecification } from "services/store";
import { Hx } from "components/LayoutHelpers";

export default () => {
  const queryContext = useContext(QueryContext);
  const querySpecification = useQuerySpecification(
    (state) => state[queryContext.key]
  );
  const toggleColumnSelection = useQuerySpecification(
    (state) => state.toggleColumnSelection
  );
  const schema = useSchema((state) => state[querySpecification.sourceLabel]);
  const selectedColumLabels = querySpecification.select.map((x) => x.label);
  const selectedTableNames = querySpecification.select.map((x) => x.tableName);
  const selectedTables = schema.rows.filter((x) =>
    selectedTableNames.includes(x.table_name)
  );

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

  return (
    <Fragment>
      <Hx x="4">Columns</Hx>
      <p className="text-gray-700 my-2">
        For any table that you select to see, there are a list of{" "}
        <strong>columns</strong> that you can choose to see or not.{" "}
        <strong>dwata</strong> figures out all the columns automatically. Even
        if you do not wish to see certain columns, you can still{" "}
        <strong>Filter</strong> or <strong>Order</strong> with them.
      </p>

      <div className="field">
        {selectedTables.map((x) => (
          <Fragment key={`sel-${x.table_name}`}>
            <Hx x="5">{x.table_name}</Hx>
            {x.columns.map((col) => (
              <BoundInput
                key={`sel-${x.table_name}-${col.name}`}
                tableName={x.table_name}
                column={col}
              />
            ))}
          </Fragment>
        ))}
      </div>
    </Fragment>
  );
};
