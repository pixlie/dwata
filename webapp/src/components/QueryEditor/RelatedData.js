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

  for (const tableName of selectedTableNames) {
    // We take out the `properties` value from the schema of this table
    const tableProperties = schema.rows.find((x) => x.table_name === tableName)
      .properties;

    // Check if this table has relations
    if (tableProperties.related_tables) {
      for (const [relatedTableName, relatedTableProperties] of Object.entries(
        tableProperties.related_tables
      )) {
        if (selectedTableNames.includes(relatedTableName)) {
          // We already have this related table in the list of selected tables, nothing to do
          continue;
        }

        if (selectedTableNames.indexOf(tableName) !== 0) {
          // We are not at the root table of our Query
          // If we are not at the root table, then we only want to related to `one-to-one` or `many-to-one` relations
          if (
            relatedTableProperties.cardinality !== "many-to-one" ||
            relatedTableProperties.cardinality !== "one-to-one"
          ) {
            continue;
          }
        }

        if (
          schema.rows.find((x) => x.table_name === relatedTableName).properties
            .is_system_table
        ) {
          continue;
        }

        if (relatedTableProperties.cardinality === "one-to-many") {
          relatedTables.push(
            <Fragment key={`tb-rl-${relatedTableName}`}>
              <BoundInput tableName={relatedTableName} />
              <p className="pl-4 mb-4 text-gray-600 text-sm">
                For each record (row of data) in <strong>{tableName}</strong>{" "}
                there may be more than one record in{" "}
                <strong>{relatedTableName}</strong>. We will show you all{" "}
                <strong>{relatedTableName}</strong> records grouped per record
                of <strong>{tableName}</strong>.
              </p>
            </Fragment>
          );
        } else {
          relatedTables.push(
            <BoundInput
              key={`tb-rl-${relatedTableName}`}
              tableName={relatedTableName}
            />
          );
        }
      }
    }
  }
  relatedTables = [...new Set(relatedTables)];

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
      {relatedTables}
    </Fragment>
  );
};
