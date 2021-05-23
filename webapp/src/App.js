import { useEffect } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import { QueryContext } from "utils";
import { useGlobal, useQueryContext } from "services/store";
import Login from "screens/Login";
import AuthenticatedInner from "screens/AuthenticatedInner";

const App = () => {
  const mainApp = useQueryContext((state) => state["main"]);
  const refreshCoreSettings = useGlobal((state) => state.refreshCoreSettings);
  const currentUser = useGlobal((state) => state.currentUser);
  const access = useGlobal((state) => state.access);

  useEffect(() => {
    refreshCoreSettings();
  }, [refreshCoreSettings]);

  useEffect(() => {
    if (
      access.isAuthenticationNeeded &&
      (!currentUser || !currentUser.isAuthenticated)
    ) {
      // redirect to login
    }
  }, []);

  return (
    <BrowserRouter>
      <QueryContext.Provider value={mainApp}>
        <Switch>
          <Route path="/auth/login" exact>
            <Login />
          </Route>

          <Route path="/">
            <AuthenticatedInner mainApp={mainApp} />
          </Route>
        </Switch>
      </QueryContext.Provider>
    </BrowserRouter>
  );
};

export default App;
