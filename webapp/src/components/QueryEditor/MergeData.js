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
  const startingTableName = querySpecification.select[0].tableName;
  let adjacentRelated = [];

  const RelatedItem = ({ tableName, innerRelated }) => {
    const handleClick = () => {
      toggleColumnSelection(queryContext.key, tableName);
    };

    return (
      <div className="flex-1">
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

        {innerRelated.map((x) => (
          <Fragment>
            <RelatedItem
              tableName={x.tableName}
              innerRelated={x.innerRelated}
            />

            <p className="pl-4 mb-4 text-gray-600 text-sm">
              For each record of <strong>{tableName}</strong> there may be more
              than one record of <strong>{x.tableName}</strong>
            </p>
          </Fragment>
        ))}
      </div>
    );
  };

  const addRelatedItem = (tableName) => {
    const innerRelated = [];
    const others = [];
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

        if (selectedTableNames.indexOf(startingTableName) !== 0) {
          // We are not at the root table of our Query
          // If we are not at the root table, then we only want to related to `X-to-one` relations
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
          // We do not show related system tables
          continue;
        }

        if (relatedTableProperties.cardinality === "one-to-many") {
          /* innerRelated.push(
            <RelatedItem tableName={relatedTableName} />
          ); */
        } else {
          others.push(relatedTableName);
        }
      }
    }

    adjacentRelated.push({
      tableName: tableName,
      innerRelated,
    });

    for (const x of others) {
      addRelatedItem(x);
    }
  };

  addRelatedItem(startingTableName);

  return (
    <div
      className="fixed bg-white border rounded p-2 shadow-md"
      style={{ top: "8rem" }}
    >
      <Hx x="5">Merge data</Hx>
      <p className="text-gray-700 my-2">
        You can merge data from other tables which are related.{" "}
        <strong>dwata</strong> finds out how the other tables are related and
        will give you contextual options as they might be needed to gather the
        right data.
      </p>

      {adjacentRelated.map((x) => (
        <RelatedItem
          key={`tb-rl-${x.tableName}`}
          tableName={x.tableName}
          innerRelated={x.innerRelated}
        />
      ))}
    </div>
  );
};
