import React, { Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { getQueryDetails } from "services/browser/getters";
import { fetchData } from "services/browser/actions";
import { toggleColumnSelection } from "services/querySpecification/actions";
import { Section, Hx } from "components/BulmaHelpers";

const ColumnSelector = ({
  isReady,
  isVisible,
  schemaColumns,
  qsColumns,
  dataColumns,
  toggleColumnSelection,
  fetchData,
}) => {
  if (!isReady || !isVisible) {
    return null;
  }

  const colsAreAvailable = qsColumns.every((col, i) =>
    dataColumns.includes(col)
  );
  const BoundInput = ({ head }) => {
    const handleClick = (event) => {
      event.preventDefault();
      toggleColumnSelection(head.name);
    };

    return (
      <Fragment>
        <input
          type="checkbox"
          name={head.name}
          checked={qsColumns.includes(head.name)}
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
