import React, { Fragment, useEffect } from "react";

import { QueryContext } from "utils";
import { useGlobal, useQueryContext } from "services/store";
import * as globalConstants from "services/global/constants";
import Navbar from "components/Navbar";
import Login from "screens/Login";
import Home from "components/Home";
import Admin from "components/Admin";
import Grid from "components/Grid";
import Detail from "components/Detail";
import Notes from "components/Notes";
import Report from "components/Report";

const AuthenticatedInner = ({ mainApp }) => {
  return (
    <Fragment>
      <Detail />
      <Notes />

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
    </Fragment>
  );
};

export default () => {
  const mainApp = useQueryContext((state) => state["main"]);
  const refreshCoreSettings = useGlobal((state) => state.refreshCoreSettings);
  const currentUser = useGlobal((state) => state.currentUser);
  const access = useGlobal((state) => state.access);

  useEffect(() => {
    refreshCoreSettings();
  }, [refreshCoreSettings]);

  return (
    <QueryContext.Provider value={mainApp}>
      <Navbar />
      <div className="block clear-both" style={{ paddingBottom: "52px" }} />

      {access.isAuthenticationNeeded &&
      (!currentUser || !currentUser.isAuthenticated) ? (
        <Login />
      ) : (
        <AuthenticatedInner mainApp={mainApp} />
      )}
    </QueryContext.Provider>
  );
};
