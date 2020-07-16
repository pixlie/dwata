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

  let dataColumns = [];
  const schemaColumns = schema.rows.find(
    (x) => x.table_name === querySpecification.tableName
  ).columns;
  const colsAreAvailable = querySpecification.columnsSelected.every((col, i) =>
    dataColumns.includes(col)
  );

  const BoundInput = ({ head }) => {
    const handleClick = () => {
      toggleColumnSelection(queryContext.key, head.name);
    };

    return (
      <Fragment>
        <input
          type="checkbox"
          name={head.name}
          checked={querySpecification.columnsSelected.includes(head.name)}
          onChange={handleClick}
        />
        &nbsp;{head.name}
      </Fragment>
    );
  };

  return (
    <Fragment>
      <Hx x="5">Columns</Hx>
      <div className="field">
        {schemaColumns.map((head, i) => (
          <div key={`col-get-${i}`} className="block">
            <label className="checkbox">
              <BoundInput head={head} />
            </label>
          </div>
        ))}
      </div>
    </Fragment>
  );
};
