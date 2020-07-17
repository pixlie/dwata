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

  const schemaColumns = schema.rows.find(
    (x) => x.table_name === querySpecification.tableName
  ).columns;

  const BoundInput = ({ head }) => {
    const handleClick = () => {
      toggleColumnSelection(queryContext.key, head.name);
    };
    const checked = querySpecification.columnsSelected.includes(head.name);

    return (
      <label
        className={`block font-mono font-normal ${
          checked ? "text-gray-700" : "text-gray-500"
        }`}
      >
        <input
          type="checkbox"
          name={head.name}
          checked={checked}
          onChange={handleClick}
          className="mr-1"
        />
        {head.name}
      </label>
    );
  };

  return (
    <Fragment>
      <Hx x="5">Columns</Hx>
      <div className="field">
        {schemaColumns.map((head, i) => (
          <BoundInput key={`col-${i}`} head={head} />
        ))}
      </div>
    </Fragment>
  );
};
