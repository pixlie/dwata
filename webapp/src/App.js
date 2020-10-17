import React from "react";

import { QueryContext } from "utils";
import { useQueryContext } from "services/store";
import * as globalConstants from "services/global/constants";
import Navbar from "components/Navbar";
// import Source from "components/Source";
// import Sidebar from "components/Sidebar";
import Home from "components/Home";
import Admin from "components/Admin";
import Grid from "components/Grid";
import Detail from "components/Detail";
import Notes from "components/Notes";
// import Actions from "components/Actions";
import Report from "components/Report";

export default () => {
  const mainApp = useQueryContext((state) => state["main"]);

  return (
    <QueryContext.Provider value={mainApp}>
      <Navbar />
      <div className="block clear-both" style={{ paddingBottom: "52px" }} />

      <Detail />
      <Notes />

      {/* <Sidebar><Source /></Sidebar> */}
      {mainApp && mainApp.appType === globalConstants.APP_NAME_BROWSER ? (
        <Grid />
      ) : null}
      {mainApp && mainApp.appType === globalConstants.APP_NAME_REPORT ? (
        <Report />
      ) : null}
      {mainApp && mainApp.appType === globalConstants.APP_NAME_ADMIN ? (
        <Admin />
      ) : null}
      {mainApp && mainApp.appType === globalConstants.APP_NAME_HOME ? (
        <Home />
      ) : null}
    </QueryContext.Provider>
  );
};
