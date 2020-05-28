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
import ColumnSelector from "components/Browser/ColumnSelector";
import FilterEditor from "components/Browser/FilterEditor";
import OrderEditor from "components/Browser/OrderEditor";
import DetailView from "components/Browser/Detail";
import Paginator from "components/Browser/Paginator";
import Notes from "components/Notes";


export default ({ initialState }) => {
  return (
    <Provider store={configureStore(initialState)}>
      <ConnectedRouter history={history}>
        <Navbar />
        <Notes />

        <Sidebar>
          <Source />
        </Sidebar>

        <Switch>
          <Route path="/browse/:sourceId/:tableName/:pk" exact>
            <Browser />
            <DetailView />
            <Paginator />
          </Route>

          <Route path="/browse/:sourceId/:tableName" exact>
            <ColumnSelector />
            <FilterEditor />
            <OrderEditor />
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