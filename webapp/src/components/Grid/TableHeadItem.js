import React, { useContext } from "react";

import { QueryContext } from "utils";
import { useData, useSchema, useQuerySpecification } from "services/store";
import FilterItem from "components/QueryEditor/FilterItem";

const ColumnHeadSpecification = ({ head }) => {
  const queryContext = useContext(QueryContext);
  const fetchData = useData((state) => state.fetchData);
  const toggleOrderBy = useQuerySpecification((state) => state.toggleOrderBy);

  const handleClick = (event) => {
    event.preventDefault();
    toggleOrderBy(queryContext.key, head);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchData(queryContext.key);
  };

  return (
    <div className="col-hd-spec-box">
      <div className="field is-grouped">
        <div className="control">
          <button className="button is-white" onClick={handleClick}>
            <i className="fas fa-sort" />
          </button>
        </div>
        <FilterItem columnName={head} />
        <div className="control">
          <button className="button is-success" onClick={handleSubmit}>
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default ({ head }) => {
  const queryContext = useContext(QueryContext);
  const querySpecification = useQuerySpecification(
    (state) => state.inner[queryContext.key]
  );
  const schema = useSchema(
    (state) => state.inner[querySpecification.sourceLabel]
  );
  const toggleColumnHeadSpecification = useQuerySpecification(
    (state) => state.toggleColumnHeadSpecification
  );
  const initiateFilter = useQuerySpecification((state) => state.initiateFilter);

  if (!(querySpecification && querySpecification.isReady)) {
    return null;
  }

  const { activeColumnHeadSpecification } = querySpecification;
  const schemaColumns = schema.rows.find(
    (x) => x.table_name === querySpecification.tableName
  ).columns;

  const handleClick = () => {
    toggleColumnHeadSpecification(queryContext.key, head);
    const dataType = schemaColumns.find((x) => x.name === head);
    initiateFilter(queryContext.key, head, dataType);
  };

  if (querySpecification.orderBy[head] === "asc") {
    return (
      <th>
        <span
          className="hd-btn has-dropdown hdicn icn-asc"
          onClick={handleClick}
        >
          {head}
        </span>
        {activeColumnHeadSpecification === head ? (
          <ColumnHeadSpecification head={head} />
        ) : null}
      </th>
    );
  } else if (querySpecification.orderBy[head] === "desc") {
    return (
      <th>
        <span
          className="hd-btn has-dropdown hdicn icn-desc"
          onClick={handleClick}
        >
          {head}
        </span>
        {activeColumnHeadSpecification === head ? (
          <ColumnHeadSpecification head={head} />
        ) : null}
      </th>
    );
  } else {
    return (
      <th>
        <span className="hd-btn has-dropdown" onClick={handleClick}>
          {head}
        </span>
        {activeColumnHeadSpecification === head ? (
          <ColumnHeadSpecification head={head} />
        ) : null}
      </th>
    );
  }
};
