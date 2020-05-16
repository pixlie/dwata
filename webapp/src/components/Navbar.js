import React from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";

import { toggleSidebar } from "services/global/actions";
import { toggleFilterEditor, toggleColumnSelector, toggleSortEditor } from "services/querySpecification/actions";
import { matchBrowserPath } from "utils";


const Navbar = ({
  sourceId, tableName, schema, isFilterEnabled, isSourceFetching,
  toggleSidebar, toggleFilterEditor, toggleColumnSelector, toggleSortEditor
}) => {
  return (
    <nav className="navbar" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <Link className="navbar-item" to="/">
          [dwata]
        </Link>

        <a role="button" className="navbar-burger burger" aria-label="menu" aria-expanded="false" href="/">
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div className="navbar-menu">
        <div className="navbar-start">
          <div className="navbar-item">
            <div className="buttons">
              <button className="button is-grey" onClick={toggleSidebar} disabled={isSourceFetching}>
                <i className="fas fa-database" />&nbsp;Sources
              </button>
            </div>
          </div>

          { tableName ? (
            <div className="navbar-item has-dropdown is-hoverable">
              <a className="navbar-link">
                <i className="fas fa-table" />&nbsp;Tables
              </a>

              { schema.isReady ? (
                <div className="navbar-dropdown">
                  { schema.rows.map(head => (
                    <Link className="navbar-item" key={`tbl-${head.table_name}`} to={`/browse/${sourceId}/${head.table_name}`}>
                      {head.table_name}
                    </Link>
                  ))}
                </div>
              ) : null }
            </div>
          ) : null }
        </div>

        <div className="navbar-end">
          <div className="navbar-item">
            <div className="field">
              <p className="control has-icons-left">
                <input className="input" type="text" placeholder="Search" />
                <span className="icon is-small is-left">
                  <i className="fas fa-search"></i>
                </span>
              </p>
            </div>
          </div>
          <div className="navbar-item">
            <div className="buttons has-addons">
              <button className="button" disabled={!isFilterEnabled} onClick={toggleColumnSelector}>
                <i className="fas fa-columns" />&nbsp;Columns
              </button>
              <button className="button" disabled={!isFilterEnabled} onClick={toggleFilterEditor}>
                <i className="fas fa-filter" />&nbsp;Filter
              </button>
              <button className="button" disabled={!isFilterEnabled} onClick={toggleSortEditor}>
                <i className="fas fa-sort" />&nbsp;Sort
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}


const mapStateToProps = (state, props) => {
  const match = matchBrowserPath(props.location.pathname);
  const { sourceId, tableName } = match != null ? match.params : { sourceId: null, tableName: null };

  return {
    schema: state.schema,
    isSourceFetching: state.source.isFetching,
    db: state.source.isReady ? state.source.rows[sourceId] : {},
    sourceId,
    tableName,
    isFilterEnabled: sourceId && tableName,
  }
}


export default withRouter(connect(
  mapStateToProps,
  {
    toggleSidebar,
    toggleFilterEditor,
    toggleColumnSelector,
    toggleSortEditor
  }
)(Navbar));