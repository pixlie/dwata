import React from "react";
import { Switch, Route } from "react-router-dom";
import { ConnectedRouter } from "connected-react-router";
import { Provider } from "react-redux";

import configureStore from "services/store";
import history from "services/history";
import Navbar from "components/Navbar";
import Source from "components/Source";
import Sidebar from "components/Sidebar";
import Home from "components/Home";
import Browser from "components/Browser";
import APIBrowser from "components/APIBrowser";
import QueryEditor from "components/Browser/QueryEditor";
import DetailView from "components/Browser/Detail";
import Paginator from "components/Browser/Paginator";


export default ({ initialState }) => {
  return (
    <Provider store={configureStore(initialState)}>
      <ConnectedRouter history={history}>
        <Navbar />

        <Sidebar>
          <Source />
        </Sidebar>

        <Switch>
          <Route path="/browse/:sourceId/:tableName/:pk" exact>
            <QueryEditor />
            <Browser />
            <DetailView />
            <Paginator />
          </Route>

          <Route path="/browse/:sourceId/:tableName" exact>
            <QueryEditor />
            <Browser />
            <Paginator />
          </Route>

          <Route path="/service/:sourceId/:resourceName" exact>
            <APIBrowser />
          </Route>

          <Route path="/" exact>
            <Home />
          </Route>
        </Switch>
      </ConnectedRouter>
    </Provider>
  );
}