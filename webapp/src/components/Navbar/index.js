import React, { useEffect } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";

import { toggleSidebar } from "services/global/actions";
import { getApps } from "services/apps/actions";
import { getSourceFromPath } from "utils";
import GridNav from "./GridNav";

const Navbar = ({ isSourceFetching, toggleSidebar, isInTable, getApps }) => {
  useEffect(() => {
    getApps();
  }, [getApps]);

  return (
    <nav className="navbar" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <Link className="navbar-item" to="/">
          Home
        </Link>

        <a
          role="button"
          className="navbar-burger burger"
          aria-label="menu"
          aria-expanded="false"
          href="/"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div className="navbar-menu">
        <div className="navbar-start">
          <div className="navbar-item">
            <div className="buttons">
              <button
                className={`button ${isInTable ? "is-grey" : "is-success"}`}
                onClick={toggleSidebar}
                disabled={isSourceFetching}
              >
                <i className="fas fa-database" />
                &nbsp;Browse
              </button>
            </div>
          </div>

          <div className="navbar-item">
            <div className="field">
              <p className="control has-icons-left">
                <input
                  className="input"
                  type="text"
                  placeholder="Coming soon..."
                />
                <span className="icon is-small is-left">
                  <i className="fas fa-search"></i>
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="navbar-end">{isInTable ? <GridNav /> : null}</div>
      </div>
    </nav>
  );
};

const mapStateToProps = (state, props) => {
  const match = getSourceFromPath(props.location.pathname);
  const { sourceId, tableName } =
    match != null ? match.params : { sourceId: null, tableName: null };
  let isInTable = false;

  if (sourceId && tableName) {
    isInTable = true;
  }

  return {
    isSourceFetching: state.source.isFetching,
    sourceId,
    tableName,
    isInTable,
  };
};

export default withRouter(
  connect(mapStateToProps, {
    toggleSidebar,
    getApps,
  })(Navbar)
);
