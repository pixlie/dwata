import React from "react";
import { Link, withRouter, matchPath } from "react-router-dom";
import { connect } from "react-redux";

import Logo from "asset/Supernova_logo_medium-removebg-preview.png";
import { toggleSidebar } from "services/global/actions";


const Navbar = ({ sourceId, tableName, db, schema, isSourceFetching, toggleSidebar }) => {
  return (
    <nav className="navbar" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <Link className="navbar-item" to="/">
          <img src={Logo} alt="Logo: Tycho's Supernova Remnant" />&nbsp;Supernova
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
                Sources
              </button>
            </div>
          </div>

          { tableName ? (
            <div className="navbar-item has-dropdown is-hoverable">
              <a className="navbar-link">
                {db.label}
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
            <div className="buttons">
              <button className="button is-info" disabled>Filter/Order</button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}


const mapStateToProps = (state, props) => {
  const match = matchPath(props.location.pathname, {
    path: "/browse/:sourceId/:tableName",
    exact: true,
    strict: false,
  });
  const { sourceId, tableName } = match != null ? match.params : { sourceId: null, tableName: null };

  return {
    schema: state.schema,
    isSourceFetching: state.source.isFetching,
    db: state.source.isReady ? state.source.rows[sourceId] : {},
    sourceId,
    tableName,
  }
}


export default withRouter(connect(
  mapStateToProps,
  { toggleSidebar }
)(Navbar));