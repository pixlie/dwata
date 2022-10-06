import { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Navbar from "components/Navbar";
import Home from "components/Home";
import Admin from "components/Admin";
import Grid from "components/Grid";
import Detail from "components/Detail";
import Notes from "components/Notes";
import Setup from "screens/Setup";
import apiClient from "utils/apiClient";
import * as responsesStatus from "utils/responseStatus";
// import AuthCheck from "components/Auth/Check";

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
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(function () {
    async function inner() {
      /**
       * dwata/backend/env is the set of .env settings in the backend without which the backend
       * cannot function
       */

      const response = await apiClient.get("/settings/dwata/backend/env");
      setIsFetching(false);
      if (response.data.status === responsesStatus.statusNotReady) {
        setIsReady(false);
      } else if (response.data.status === responsesStatus.statusReady) {
        setIsReady(true);
      }
    }

    inner();
  }, []);

  if (isFetching) {
    return <p>Loading...</p>;
  }

  if (!isReady) {
    return (
      <>
        <p>
          You have not set the initial settings in <pre>dwata/backend/.env</pre>
        </p>
        <p>
          Please copy <pre>dwata/backend/.env.copy</pre> as a new file{" "}
          <pre>dwata/backend/.env</pre> and set the values as in comments
        </p>
      </>
    );
  }

  return (
    <Router>
      <Route path="/setup">
        <Setup />
      </Route>

      <Route path="">
        <AuthEnabledRoutes />
      </Route>
    </Router>
  );
}

export default App;
