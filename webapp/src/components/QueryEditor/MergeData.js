import React, { Fragment, useContext } from "react";

import { QueryContext } from "utils";
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
  const allSelected = [
    ...querySpecification.select,
    ...querySpecification.embedded.reduce((acc, cur) => [...acc, ...cur], []),
  ];
  const selectedTableNames = [...new Set(allSelected.map((x) => x.tableName))];
  const startingTableName = querySpecification.select[0].tableName;

  const RelatedItem = ({ tableName, innerRelated }) => {
    if (tableName === undefined || innerRelated === undefined) {
      return null;
    }

    const handleClick = () => {
      toggleRelatedTable(queryContext.key, tableName);
    };

    const innerItems = innerRelated.map((x) => (
      <Fragment key={`tb-rl-${x.tableName}`}>
        <RelatedItem tableName={x.tableName} innerRelated={x.innerRelated} />

        {innerRelated.length === 1 ? (
          <p className="pl-4 mb-4 text-gray-600 text-sm max-w-sm">
            For each record of <strong>{tableName}</strong> there may be more
            than one record of <strong>{x.tableName}</strong>
          </p>
        ) : null}
      </Fragment>
    ));

    if (innerRelated.length > 0) {
      return (
        <div className="py-1 px-2 bg-gray-200 border mx-2">
          <label className="block font-bold text-gray-700 py-1 px-2 mb-1 hover:bg-gray-300">
            <input
              type="checkbox"
              name={tableName}
              checked={selectedTableNames.includes(tableName)}
              onChange={handleClick}
              className="mr-1"
            />
            {tableName}
          </label>

          {innerRelated.length > 1 ? (
            <p className="pl-4 mb-4 text-gray-600 text-sm max-w-sm">
              For each record of <strong>{tableName}</strong> there may be more
              than one record of any of the following.
            </p>
          ) : null}
          <div className="pl-6">{innerItems}</div>
        </div>
      );
    } else {
      return (
        <div>
          <label className="block font-bold bg-gray-200 text-gray-700 py-1 px-2 mb-1 hover:bg-gray-300 w-64">
            <input
              type="checkbox"
              name={tableName}
              checked={selectedTableNames.includes(tableName)}
              onChange={handleClick}
              className="mr-1"
            />
            {tableName}
          </label>
        </div>
      );
    }
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
          } else {
            _adjacent.push(relatedTableName);
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
      className="fixed bg-white border rounded p-4 shadow-md"
      style={{ top: "8rem" }}
    >
      <Hx x="3">Merge data</Hx>
      <p className="text-gray-700 my-2 max-w-lg">
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
