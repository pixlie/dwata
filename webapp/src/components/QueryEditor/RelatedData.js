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

  const tableProperties = schema.rows.find(
    (x) => x.table_name === querySpecification.tableName
  ).properties;

  const BoundInput = ({ table }) => {
    const handleClick = () => {
      toggleColumnSelection(queryContext.key, table);
    };

    return (
      <label className="block font-mono font-normal text-gray-700">
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
      <div className="field">
        {tableProperties.related_tables.map((table, i) => (
          <BoundInput key={`tb-rl-${i}`} table={table} />
        ))}
      </div>
    </Fragment>
  );
};
