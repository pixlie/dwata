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
  let relatedTables = [];

  for (const tableColumn of querySpecification.select) {
    // tableColumn is an object that has label, tableName, columnName...
    const tableProperties = schema.rows.find(
      (x) => x.table_name === tableColumn.tableName
    ).properties;
    if (tableProperties.related_tables) {
      for (const relatedTable of tableProperties.related_tables) {
        if (
          !schema.rows.find((x) => x.table_name === relatedTable).properties
            .is_system_table
        ) {
          relatedTables.push(relatedTable);
        }
      }
    }
  }
  relatedTables = [...new Set(relatedTables)];

  const BoundInput = ({ table }) => {
    const handleClick = () => {
      toggleColumnSelection(queryContext.key, table);
    };

    return (
      <label className="block font-bold text-gray-700 bg-gray-200 py-1 px-2 mb-1 border hover:bg-gray-300">
        <input
          type="checkbox"
          name={table}
          onChange={handleClick}
          className="mr-1"
        />
        {table}
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

      {relatedTables.map((table, i) => (
        <BoundInput key={`tb-rl-${i}`} table={table} />
      ))}
    </Fragment>
  );
};
