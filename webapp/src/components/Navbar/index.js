import React from "react";

import { useQueryContext } from "services/store";
import * as globalConstants from "services/global/constants";
import GridNav from "./GridNav";
import HomeNav from "./HomeNav";

function Navbar({ isSourceFetching, toggleSidebar }) {
  const mainApp = useQueryContext((state) => state["main"]);
  const setContext = useQueryContext((state) => state.setContext);

  const handleHome = (event) => {
    event.preventDefault();
    setContext("main", {
      appType: globalConstants.APP_NAME_HOME,
    });
  };

  /* const handleNotesClick = () => {
    showNotes();
  }; */

  return (
    <nav
      className="fixed top-0 w-screen flex items-center bg-white border-b border-gray-300 px-6 py-3 z-10"
      role="navigation"
      aria-label="main navigation"
    >
      <div className="mx-4">
        <a
          className={`font-semibold text-lg ${
            mainApp && mainApp.appType === globalConstants.APP_NAME_HOME
              ? "text-gray-700"
              : "text-gray-500"
          }`}
          href="/"
          onClick={handleHome}
        >
          Home
        </a>
      </div>

      <div className="block lg:inline-block lg:mt-0 px-4">&nbsp;</div>

      <div className="block lg:inline-block items-center">
        {/* <Button
            theme={
              mainApp && mainApp.appType === globalConstants.APP_NAME_HOME
                ? "primary"
                : "secondary"
            }
            attributes={{ onClick: toggleSidebar, disabled: isSourceFetching }}
          >
            <i className="fas fa-database" />
            &nbsp;Browse
          </Button> */}

        {/* <span className="relative">
            <Button
              attributes={{ onClick: handleNotesClick, ref: notesButtonRef }}
              theme="info"
            >
              <i className="far fa-sticky-note" />
              &nbsp; Notes
            </Button>
          </span> */}

        {/* <div className="inline-block">
            <input className="input" type="text" placeholder="Coming soon..." />
            <span className="icon is-small is-left">
              <i className="fas fa-search"></i>
            </span>
          </div> */}
      </div>

      <div className="block lg:inline-block flex-grow">
        {mainApp && mainApp.appType === globalConstants.APP_NAME_BROWSER ? (
          <GridNav />
        ) : null}
        {mainApp && mainApp.appType === globalConstants.APP_NAME_HOME ? (
          <HomeNav />
        ) : null}
      </div>
    </nav>
  );
}

export default Navbar;
