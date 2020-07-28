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
  const selectedTableNames = [
    ...new Set(querySpecification.select.map((x) => x.tableName)),
  ];
  let relatedTables = [];

  for (const tableColumn of querySpecification.select) {
    // tableColumn is an object that has label, tableName, columnName...
    const tableProperties = schema.rows.find(
      (x) => x.table_name === tableColumn.tableName
    ).properties;
    if (tableProperties.related_tables) {
      for (const relatedTableName of Object.keys(
        tableProperties.related_tables
      )) {
        if (selectedTableNames.includes(relatedTableName)) {
          continue;
        }
        if (
          !schema.rows.find((x) => x.table_name === relatedTableName).properties
            .is_system_table
        ) {
          relatedTables.push(relatedTableName);
        }
      }
    }
  }
  relatedTables = [...new Set(relatedTables)];

  const BoundInput = ({ tableName }) => {
    const handleClick = () => {
      toggleColumnSelection(queryContext.key, tableName);
    };

    return (
      <label className="block font-bold text-gray-700 bg-gray-200 py-1 px-2 mb-1 border hover:bg-gray-300">
        <input
          type="checkbox"
          name={tableName}
          checked={selectedTableNames.includes(tableName)}
          onChange={handleClick}
          className="mr-1"
        />
        {tableName}
      </label>
    );
  };

  return (
    <Fragment>
      <Hx x="5">Related</Hx>
      <p className="text-gray-700 my-2">
        You can merge data from other tables which <strong>dwata</strong> finds
        are related. dwata figures out how the other tables are related and will
        give you contextual options as they might be needed to extract the right
        merged data.
      </p>

      {selectedTableNames.map((tableName) => (
        <BoundInput key={`tb-rl-${tableName}`} tableName={tableName} />
      ))}
      {relatedTables.map((tableName) => (
        <BoundInput key={`tb-rl-${tableName}`} tableName={tableName} />
      ))}
    </Fragment>
  );
};
