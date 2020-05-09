import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Provider } from "react-redux";

import store from "services/store";
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
    <Provider store={store(initialState)}>
      <BrowserRouter>
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
      </BrowserRouter>
    </Provider>
  );
}