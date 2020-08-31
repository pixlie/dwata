import React from "react";

import { QueryContext } from "utils";
import { useQueryContext } from "services/store";
import * as globalConstants from "services/global/constants";
import Navbar from "components/Navbar";
// import Source from "components/Source";
// import Sidebar from "components/Sidebar";
import Home from "components/Home";
import Grid from "components/Grid";
import Notes from "components/Notes";
// import Actions from "components/Actions";
import Report from "components/Report";
import Detail from "components/Detail";

export default () => {
  const mainApp = useQueryContext((state) => state["main"]);

  return (
    <QueryContext.Provider value={mainApp}>
      <Navbar />
      <div className="block clear-both" style={{ paddingBottom: "57px" }} />
      <Detail />
      <Notes />
      {/* <Sidebar><Source /></Sidebar> */}

      {mainApp && mainApp.appType === globalConstants.APP_NAME_BROWSER ? (
        <Grid />
      ) : null}

      {mainApp && mainApp.appType === globalConstants.APP_NAME_REPORT ? (
        <Report />
      ) : null}

      {mainApp && mainApp.appType === globalConstants.APP_NAME_HOME ? (
        <Home />
      ) : null}
    </QueryContext.Provider>
  );
};
