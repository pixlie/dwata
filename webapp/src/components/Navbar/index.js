import React from "react";

import { useQueryContext } from "services/store";
import * as globalConstants from "services/global/constants";
import { Button } from "components/LayoutHelpers";
import GridNav from "./GridNav";

export default ({ isSourceFetching, toggleSidebar, isInTable }) => {
  const mainApp = useQueryContext((state) => state["main"]);
  const setContext = useQueryContext((state) => state.setContext);
  const handleHome = (event) => {
    event.preventDefault();
    setContext("main", {
      appType: globalConstants.APP_NAME_HOME,
    });
  };

  return (
    <nav
      className="fixed top-0 w-screen flex items-center bg-gray-100"
      role="navigation"
      aria-label="main navigation"
    >
      <div className="flex items-center flex-shrink-0 mx-4 px-4">
        <a className="font-bold text-2xl" href="/" onClick={handleHome}>
          Home
        </a>
      </div>

      <div className="block lg:inline-block lg:mt-0 p-4">&nbsp;</div>

      <div className="block flex-grow items-center w-auto">
        <div className="inline-block">
          <Button
            attributes={{ onClick: toggleSidebar, disabled: isSourceFetching }}
          >
            <i className="fas fa-database" />
            &nbsp;Browse
          </Button>

          <div className="inline-block">
            <input className="input" type="text" placeholder="Coming soon..." />
            <span className="icon is-small is-left">
              <i className="fas fa-search"></i>
            </span>
          </div>
        </div>

        <div className="inline-block">
          {mainApp && mainApp.appType === globalConstants.APP_NAME_BROWSER ? (
            <GridNav />
          ) : null}
        </div>
      </div>
    </nav>
  );
};
