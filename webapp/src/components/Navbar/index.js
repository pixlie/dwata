import React from "react";

import useGlobal from "services/global/store";
import * as globalConstants from "services/global/constants";
import GridNav from "./GridNav";

export default ({ isSourceFetching, toggleSidebar, isInTable }) => {
  const mainApp = useGlobal((state) => state.inner.mainApp);
  const setMainApp = useGlobal((state) => state.setMainApp);
  const handleHome = (event) => {
    event.preventDefault();
    setMainApp(globalConstants.APP_NAME_HOME);
  };

  return (
    <nav className="navbar" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <a className="navbar-item" href="/" onClick={handleHome}>
          Home
        </a>

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
                className={`button ${
                  mainApp === globalConstants.APP_NAME_BROWSER
                    ? "is-grey"
                    : "is-success"
                }`}
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

        <div className="navbar-end">
          {mainApp === globalConstants.APP_NAME_BROWSER ? <GridNav /> : null}
        </div>
      </div>
    </nav>
  );
};
