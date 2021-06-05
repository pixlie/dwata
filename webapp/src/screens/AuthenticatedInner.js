import { Switch, Route } from "react-router-dom";

import Navbar from "components/Navbar";
import Home from "components/Home";
import Admin from "screens/Admin";
import Grid from "components/Grid";
import Detail from "components/Detail";
import Notes from "components/Notes";
import Report from "components/Report";

const AuthenticatedInner = ({ mainApp }) => {
  return (
    <>
      <Navbar />
      <div className="block clear-both" style={{ paddingBottom: "52px" }} />

      <Switch>
        <Route path="/explore">
          <>
            <Detail />
            <Notes />

            <Grid containerName="main" />
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
