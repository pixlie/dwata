import { Switch, Route } from "react-router-dom";

import * as globalConstants from "services/global/constants";
import Navbar from "components/Navbar";
import Home from "components/Home";
import Admin from "components/Admin";
import Grid from "components/Grid";
import Detail from "components/Detail";
import Notes from "components/Notes";
import Report from "components/Report";

const AuthenticatedInner = ({ mainApp }) => {
  /*
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
  */

  return (
    <>
      <Navbar />
      <div className="block clear-both" style={{ paddingBottom: "52px" }} />

      <Switch>
        <Route path="/explore">
          <>
            <Detail />
            <Notes />

            <Grid />
          </>
        </Route>

        <Route path="/reports">
          <Report />
        </Route>

        <Route path="/manage">
          <Admin />
        </Route>

        <Route path="" exact>
          <Home />
        </Route>
      </Switch>
    </>
  );
};

export default AuthenticatedInner;
