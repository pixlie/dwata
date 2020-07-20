import React, { useContext } from "react";

import { QueryContext } from "utils";
import { useSchema, useQuerySpecification } from "services/store";
import { getColumnSchema } from "services/querySpecification/getters";
import FilterItem from "components/QueryEditor/FilterItem";
import { ColumnHead } from "components/LayoutHelpers";

const ColumnHeadSpecification = ({ tableColumnName }) => {
  const queryContext = useContext(QueryContext);
  const toggleOrderBy = useQuerySpecification((state) => state.toggleOrderBy);

  const handleClick = () => {
    toggleOrderBy(queryContext.key, tableColumnName);
  };

  return (
    <div className="col-hd-spec-box">
      <div className="field is-grouped">
        <div className="control">
          <button className="button is-white" onClick={handleClick}>
            <i className="fas fa-sort" />
          </button>
        </div>

        <FilterItem columnName={tableColumnName} singleFilter />
      </div>
    </div>
  );
};

export default ({ tableColumnName }) => {
  const queryContext = useContext(QueryContext);
  const querySpecification = useQuerySpecification(
    (state) => state[queryContext.key]
  );
  const schema = useSchema((state) => state[querySpecification.sourceLabel]);
  const toggleColumnHeadSpecification = useQuerySpecification(
    (state) => state.toggleColumnHeadSpecification
  );
  const initiateFilter = useQuerySpecification((state) => state.initiateFilter);

  const { activeColumnHeadSpecification } = querySpecification;

  const handleClick = () => {
    toggleColumnHeadSpecification(queryContext.key, tableColumnName);
    const dataType = getColumnSchema(schema.rows, tableColumnName);
    initiateFilter(queryContext.key, tableColumnName, dataType);
  };

  return (
    <ColumnHead
      label={tableColumnName}
      order={querySpecification.orderBy[tableColumnName]}
      attributes={{ onClick: handleClick }}
    >
      {activeColumnHeadSpecification === tableColumnName ? (
        <ColumnHeadSpecification tableColumnName={tableColumnName} />
      ) : null}
    </ColumnHead>
  );
};
