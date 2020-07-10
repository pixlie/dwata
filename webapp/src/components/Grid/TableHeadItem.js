import React, { useContext } from "react";

import { QueryContext } from "utils";
import useGlobal from "services/global/store";
import useData from "services/data/store";
import useSchema from "services/schema/store";
import useQuerySpecification from "services/querySpecification/store";
import {
  toggleOrderBy,
  initiateFilter,
} from "services/querySpecification/actions";
import { toggleColumnHeadSpecification } from "services/global/actions";
import FilterItem from "components/QueryEditor/FilterItem";

const ColumnHeadSpecification = ({ head }) => {
  const queryContext = useContext(QueryContext);
  const fetchData = useData((state) => state.fetchData);
  const handleClick = (event) => {
    event.preventDefault();
    // toggleOrderBy(head);
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
  const activeColumnHeadSpecification = useGlobal(
    (state) => state.inner.activeColumnHeadSpecification
  );
  const schema = useSchema((state) => state.inner[queryContext.sourceLabel]);
  const querySpecification = useQuerySpecification(
    (state) => state.inner[queryContext.key]
  );
  const schemaColumns = schema.rows.find(
    (x) => x.table_name === queryContext.tableName
  ).columns;

  const handleClick = (event) => {
    event.preventDefault();
    toggleColumnHeadSpecification(head);
    const dataType = schemaColumns.find((x) => x.name === head);
    // initiateFilter(head, dataType);
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
