import React, { useEffect } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";

import { toggleSidebar, showNotes, toggleFilterEditor, toggleColumnSelector,
  toggleSortEditor, toggleActions } from "services/global/actions";
import { getApps } from "services/apps/actions";
import { getSourceFromPath } from "utils";


const Navbar = ({
  sourceId, tableName, schema, isFilterEnabled, isSourceFetching, pathKey, selectedRowList,
  toggleSidebar, toggleFilterEditor, toggleColumnSelector, toggleSortEditor, isInTable,
  hasColumnsSpecified, hasFiltersSpecified, hasOrderingSpecified, showNotes, getApps, toggleActions
}) => {
  useEffect(() => {
    getApps();
  }, [getApps]);
  const handleNotesClick = event => {
    event.preventDefault();
    showNotes(pathKey);
  }
  const handleActionsClick = event => {
    event.preventDefault();
    toggleActions();
  }

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
              <button className={`button ${isInTable ? "is-grey" : "is-success"}`} onClick={toggleSidebar} disabled={isSourceFetching}>
                <i className="fas fa-database" />&nbsp;Sources
              </button>
            </div>
          </div>

          {tableName ? (
            <div className="navbar-item has-dropdown is-hoverable">
              <span className="navbar-link">
                <i className="fas fa-table" />&nbsp;Tables
              </span>

              {schema.isReady ? (
                <div className="navbar-dropdown">
                  {schema.rows.filter(s => s.properties.is_system_table === false).map(head => (
                    <Link className="navbar-item" key={`tbl-${head.table_name}`} to={`/browse/${sourceId}/${head.table_name}`}>
                      {head.table_name}
                    </Link>
                  ))}
                  <hr className="navbar-divider" />
                  <div className="navbar-item">System tables</div>
                  {schema.rows.filter(s => s.properties.is_system_table === true).map(head => (
                    <Link className="navbar-item" key={`tbl-${head.table_name}`} to={`/browse/${sourceId}/${head.table_name}`}>
                      {head.table_name}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="navbar-end">
          {isInTable ? (
            <div className="navbar-item">
              <div className="field">
                <p className="control has-icons-left">
                  <input className="input" type="text" placeholder="Coming soon..." />
                  <span className="icon is-small is-left">
                    <i className="fas fa-search"></i>
                  </span>
                </p>
              </div>
            </div>
          ): null}

          {isInTable ? (
            <div className="navbar-item">
              <div className="field">
                <p className="control">
                  <button className={`button ${selectedRowList.length > 0 ? " is-success" : ""}`} disabled={selectedRowList.length === 0} onClick={handleActionsClick}>
                    <span className="icon">
                      <i className="far fa-check-square" />
                    </span>&nbsp; Actions
                  </button>
                </p>
              </div>
            </div>
          ) : null}

          {isInTable ? (
            <div className="navbar-item">
              <div className="field">
                <p className="control">
                  <button className="button" onClick={handleNotesClick}>
                    <span className="icon">
                      <i className="far fa-sticky-note" />
                    </span>&nbsp; Notes
                  </button>
                </p>
              </div>
            </div>
          ) : null}

          {isInTable ? (
            <div className="navbar-item">
              <div className="buttons has-addons">
                <button className={`button${hasColumnsSpecified ? " is-spec" : ""}`} disabled={!isFilterEnabled} onClick={toggleColumnSelector}>
                  <i className="fas fa-columns" />&nbsp;Columns
                </button>
                <button className={`button${hasFiltersSpecified ? " is-spec" : ""}`} disabled={!isFilterEnabled} onClick={toggleFilterEditor}>
                  <i className="fas fa-filter" />&nbsp;Filters
                </button>
                <button className={`button${hasOrderingSpecified ? " is-spec" : ""}`} disabled={!isFilterEnabled} onClick={toggleSortEditor}>
                  <i className="fas fa-sort" />&nbsp;Ordering
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </nav>
  );
}


const mapStateToProps = (state, props) => {
  const match = getSourceFromPath(props.location.pathname);
  const {sourceId, tableName} = match != null ? match.params : {sourceId: null, tableName: null};
  let isInTable = false;
  let hasColumnsSpecified = false;
  let hasFiltersSpecified = false;
  let hasOrderingSpecified = false;
  const _browserCacheKey = btoa(`${sourceId}/${tableName}`);
  if (sourceId && tableName) {
    isInTable = true;
    if (state.schema.isReady && state.schema.sourceId === parseInt(sourceId) &&
      state.browser.isReady && state.browser._cacheKey === _browserCacheKey &&
      state.querySpecification.isReady && state.querySpecification._cacheKey === _browserCacheKey) {
      hasColumnsSpecified = state.querySpecification.columnsSelected.length !== state.schema.rows.find(x => x.table_name === tableName).columns.length;
      hasFiltersSpecified = Object.keys(state.querySpecification.filterBy).length > 0;
      hasOrderingSpecified = Object.keys(state.querySpecification.orderBy).length > 0;
    }
  }

  return {
    schema: state.schema,
    isSourceFetching: state.source.isFetching,
    sourceId,
    tableName,
    isFilterEnabled: sourceId && tableName,
    isInTable,
    hasColumnsSpecified,
    hasFiltersSpecified,
    hasOrderingSpecified,
    selectedRowList: state.browser.selectedRowList,
    pathKey: _browserCacheKey,
  }
}


export default withRouter(connect(
  mapStateToProps,
  {
    toggleSidebar,
    toggleFilterEditor,
    toggleColumnSelector,
    toggleSortEditor,
    showNotes,
    getApps,
    toggleActions,
  }
)(Navbar));