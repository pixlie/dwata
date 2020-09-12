import React, { useRef, useEffect } from "react";

import { useQueryContext, useGlobal } from "services/store";
import * as globalConstants from "services/global/constants";
import { Button } from "components/LayoutHelpers";
import ProductGuide from "components/ProductGuide";
import GridNav from "./GridNav";

export default ({ isSourceFetching, toggleSidebar }) => {
  const mainApp = useQueryContext((state) => state["main"]);
  const setContext = useQueryContext((state) => state.setContext);
  const showNotes = useGlobal((state) => state.showNotes);
  const setNavigationButtonMeta = useGlobal(
    (state) => state.setNavigationButtonMeta
  );
  const notesButtonRef = useRef(null);
  useEffect(() => {
    notesButtonRef.current &&
      setNavigationButtonMeta("notes", {
        position: {
          top: notesButtonRef.current.getBoundingClientRect().top,
          left: notesButtonRef.current.getBoundingClientRect().left,
        },
      });
  }, []);

  const handleHome = (event) => {
    event.preventDefault();
    setContext("main", {
      appType: globalConstants.APP_NAME_HOME,
    });
  };

  const handleNotesClick = () => {
    showNotes();
  };

  return (
    <nav
      className="fixed top-0 w-screen flex items-center bg-white border-b border-gray-300 px-6 z-10"
      role="navigation"
      aria-label="main navigation"
    >
      <div className="mx-4">
        <a
          className="font-semibold text-lg text-gray-700"
          href="/"
          onClick={handleHome}
        >
          Home
        </a>
      </div>

      <div className="block lg:inline-block lg:mt-0 p-4">&nbsp;</div>

      <div className="block lg:inline-block flex-grow items-center w-auto">
        <div className="inline-block">
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

          <span className="relative">
            <Button
              attributes={{ onClick: handleNotesClick, ref: notesButtonRef }}
              theme="info"
            >
              <i className="far fa-sticky-note" />
              &nbsp; Notes
            </Button>
            <ProductGuide guideFor="notesButton" />
          </span>

          {/* <div className="inline-block">
            <input className="input" type="text" placeholder="Coming soon..." />
            <span className="icon is-small is-left">
              <i className="fas fa-search"></i>
            </span>
          </div> */}
        </div>
      </div>

      <div className="block lg:inline-block">
        {mainApp && mainApp.appType === globalConstants.APP_NAME_BROWSER ? (
          <GridNav />
        ) : null}
      </div>
    </nav>
  );
};
