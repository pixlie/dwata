import React, { Fragment, useContext } from "react";

import { QueryContext } from "utils";
import {
  useGlobal,
  useSchema,
  useData,
  useQuerySpecification,
} from "services/store";
import { Section, Hx } from "components/BulmaHelpers";

export default () => {
  const queryContext = useContext(QueryContext);
  const data = useData((state) => state[queryContext.key]);
  const fetchData = useData((state) => state.fetchData);
  const isCSVisible = useGlobal((state) => state.isCSVisible);
  const querySpecification = useQuerySpecification(
    (state) => state[queryContext.key]
  );
  const toggleColumnSelection = useQuerySpecification(
    (state) => state.toggleColumnSelection
  );
  const schema = useSchema((state) => state[querySpecification.sourceLabel]);

  if (
    !(
      data &&
      data.isReady &&
      isCSVisible &&
      querySpecification &&
      querySpecification.isReady
    )
  ) {
    return null;
  }

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

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchData();
  };

  return (
    <div id="column-selector">
      <Section>
        <Hx x="4">Columns</Hx>
        <div className="field">
          {schemaColumns.map((head, i) => (
            <div key={`col-get-${i}`} className="control">
              <label className="checkbox">
                <BoundInput head={head} />
              </label>
            </div>
          ))}
        </div>
        {!colsAreAvailable ? (
          <div className="help">New column data needs to be fetched</div>
        ) : null}
        <button
          className="button is-fullwidth is-success"
          disabled={colsAreAvailable}
          onClick={handleSubmit}
        >
          Apply
        </button>
      </Section>
    </div>
  );
};

/*
const mapStateToProps = (state, props) => {
  const { cacheKey, sourceId, tableName } = getQueryDetails(state, props);

  if (
    state.schema.isReady &&
    state.schema.sourceId === sourceId &&
    state.browser.isReady &&
    state.browser.cacheKey === cacheKey &&
    state.querySpecification.isReady &&
    state.querySpecification.cacheKey === cacheKey
  ) {
    return {
      isReady: true,
      sourceId,
      tableName,
      schemaColumns: state.schema.rows.find((x) => x.table_name === tableName)
        .columns,
      dataColumns: state.browser.columns,
      qsColumns: state.querySpecification.columnsSelected,
      isVisible: state.global.isCSVisible,
    };
  }

  return {
    isReady: false,
  };
};

export default withRouter(
  connect(mapStateToProps, {
    toggleColumnSelection,
    fetchData,
  })(ColumnSelector)
);
*/
