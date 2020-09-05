import React, { Fragment, useContext } from "react";

import { QueryContext, tableColorWhiteOnMedium } from "utils";
import { useSchema, useQuerySpecification } from "services/store";
import { Hx } from "components/LayoutHelpers";

export default () => {
  const queryContext = useContext(QueryContext);
  const querySpecification = useQuerySpecification(
    (state) => state[queryContext.key]
  );
  const toggleRelatedTable = useQuerySpecification(
    (state) => state.toggleRelatedTable
  );
  const schema = useSchema((state) => state[querySpecification.sourceLabel]);
  const selectedTableNames = [
    ...new Set(querySpecification.select.map((x) => x.tableName)),
  ];
  const startingTableName = querySpecification.select[0].tableName;
  const addedTableNames = [startingTableName];
  const tableColors = querySpecification.tableColors;

  const RelatedItem = ({ tableName, innerRelated }) => {
    if (tableName === undefined || innerRelated === undefined) {
      return null;
    }

    const handleClick = () => {
      toggleRelatedTable(queryContext.key, tableName);
    };

    return (
      <div
        className={`max-w-xs mr-4 ${
          innerRelated.length > 0 ? "bg-gray-100 pb-4" : ""
        }`}
      >
        <label
          className={`block px-2 font-bold cursor-pointer rounded
            ${
              selectedTableNames.includes(tableName)
                ? `${tableColorWhiteOnMedium(
                    tableColors[tableName]
                  )} text-white`
                : "bg-gray-100 text-gray-600"
            }
            ${innerRelated.length > 0 ? " rounded-b-none" : ""}`}
        >
          <span
            className={`text-lg ml-2 mr-3 ${
              selectedTableNames.includes(tableName)
                ? "text-white"
                : "text-gray-600"
            }`}
          >
            <i className="fas fa-table" />
          </span>
          <input
            type="checkbox"
            name={tableName}
            checked={selectedTableNames.includes(tableName)}
            onChange={handleClick}
            className="mr-1"
          />
          {tableName}
        </label>

        {innerRelated.length > 0 ? (
          <p className="mx-2 my-4 text-gray-600 text-sm">
            Each record of <strong>{tableName}</strong> may have more than one
            record of any of the following.
          </p>
        ) : null}
        <div className="ml-6">
          {innerRelated.map((x) => (
            <RelatedItem
              key={`tb-rl-${x.tableName}`}
              tableName={x.tableName}
              innerRelated={x.innerRelated}
            />
          ))}
        </div>
      </div>
    );
  };

  const addRelatedItem = (tableName, level) => {
    const _inner = [];
    const _adjacent = [];

    if (level === 0) {
      const tableProperties = schema.rows.find(
        (x) => x.table_name === tableName
      ).properties;

      // Check if this table has relations
      if (tableProperties.related_tables) {
        for (const [relatedTableName, relatedTableProperties] of Object.entries(
          tableProperties.related_tables
        )) {
          /* if (selectedTableNames.includes(relatedTableName)) {
            // We already have this related table in the list of selected tables, nothing to do
            continue;
          } */

          if (addedTableNames.includes(relatedTableName)) {
            continue;
          }

          if (relatedTableName === tableName) {
            continue;
          }

          if (
            tableName !== startingTableName &&
            !selectedTableNames.includes(tableName)
          ) {
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
            schema.rows.find((x) => x.table_name === relatedTableName)
              .properties.is_system_table
          ) {
            // We do not show related system tables
            continue;
          }

          if (relatedTableProperties.cardinality === "one-to-many") {
            _inner.push(relatedTableName);
            addedTableNames.push(relatedTableName);
          } else {
            _adjacent.push(relatedTableName);
            addedTableNames.push(relatedTableName);
          }
        }
      }
    }

    const thisItem = {
      tableName: tableName,
      innerRelated: _inner.reduce(
        (acc, cur) => [...acc, ...addRelatedItem(cur, level + 1)],
        []
      ),
    };

    return _adjacent.reduce(
      (acc, cur) => [...acc, ...addRelatedItem(cur, level)],
      [thisItem]
    );
  };

  const adjacentRelated = addRelatedItem(startingTableName, 0);

  return (
    <div
      className="fixed right-0 bg-white border rounded p-4 shadow-md"
      style={{ top: "4rem", right: "1rem" }}
    >
      <Hx x="4">Merge related data</Hx>

      <p className="text-sm text-gray-700 my-2 max-w-2xl">
        You can merge data from other tables which are related.{" "}
        <strong>dwata</strong> finds out how the other tables are related and
        will give you contextual options as they might be needed to gather the
        right data.
      </p>

      <div className="flex flex-row">
        {adjacentRelated.map((x) => (
          <RelatedItem
            key={`tb-rl-${x.tableName}`}
            tableName={x.tableName}
            innerRelated={x.innerRelated}
          />
        ))}
      </div>
    </div>
  );
};
