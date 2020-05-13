import React, { Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { fetchData } from "services/browser/actions";
import { toggleColumnSelection } from "services/querySpecification/actions";
import { Section, Hx } from "components/BulmaHelpers";


const ColumnSelector = ({sourceId, tableName, schema, isVisible, columns, originalColumns, toggleColumnSelection, fetchData}) => {
  if (sourceId === null || tableName === null || !isVisible) {
    return null;
  }
  const areEqual = columns.length === originalColumns.length &&
    columns.sort().every(function(value, index) { return value === originalColumns.sort()[index]});

  const BoundInput = ({head}) => {
    const handleClick = event => {
      event.preventDefault();
      toggleColumnSelection(head.name);
    }

    return (
      <Fragment>
        <input type="checkbox" name={head.name} checked={columns.includes(head.name)} onChange={handleClick} />&nbsp;{head.name}
      </Fragment>
    )
  }

  const handleSubmit = event => {
    event.preventDefault();
    fetchData();
  };

  return (
    <div id="query-editor">
      <Section>
        <Hx x="6">Visible columns</Hx>
        <div className="field">
          {schema.columns.map((head, i) => (
            <div key={`col-get-${i}`} className="control">
              <label className="checkbox">
                <BoundInput head={head} />
              </label>
            </div>
          ))}
        </div>
        <button className="button is-fullwidth is-success" disabled={areEqual} onClick={handleSubmit}>Apply</button>
      </Section>
    </div>
  );
}


const mapStateToProps = (state, props) => {
  let { sourceId, tableName } = props.match.params;
  sourceId = parseInt(sourceId);
  const _browserCacheKey = `${sourceId}/${tableName}`;

  return {
    sourceId,
    tableName,
    schema: state.schema.isReady && state.schema.sourceId === parseInt(sourceId) ? {
      ...state.schema.rows.find(x => x.table_name === tableName),
      isReady: true,
    } : {
      isReady: false,
    },
    columns: [...state.querySpecification.columnsSelected],  // Need to do shallow copy else sorting in component will sort in Redux state
    originalColumns: [...state.browser.columns],
    isVisible: state.querySpecification.isCSVisible,
  }
}


export default withRouter(connect(
  mapStateToProps,
  {
    toggleColumnSelection,
    fetchData,
  }
)(ColumnSelector));