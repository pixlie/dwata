import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Navbar from "components/Navbar";
import Home from "components/Home";
import Admin from "components/Admin";
import Grid from "components/Grid";
import Detail from "components/Detail";
import Notes from "components/Notes";
import AuthCheck from "components/Auth/Check";

function AuthEnabledRoutes() {
  return (
    <>
      <Navbar />
      <div className="block clear-both" style={{ paddingBottom: "52px" }} />

      <Detail />
      <Notes />

      <Switch>
        <Route path="/browse">
          <Grid />
        </Route>

        <Route path="/admin">
          <Admin />
        </Route>

        <Route path="/" exact>
          <Home />
        </Route>
      </Switch>
    </>
  );
}

function App() {
  return (
    <Router>
      <Route path="/setup"></Route>

      <Route path="">
        <AuthCheck>
          <AuthEnabledRoutes />
        </AuthCheck>
      </Route>
    </Router>
  );
}

export default App;
