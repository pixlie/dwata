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
import Grid from "components/Grid";
import DetailView from "components/Detail";
import Kanban from "components/Kanban";
import APIBrowser from "components/APIBrowser";
import ColumnSelector from "components/QueryEditor/ColumnSelector";
import FilterEditor from "components/QueryEditor/FilterEditor";
import OrderEditor from "components/QueryEditor/OrderEditor";
import Paginator from "components/QueryEditor/Paginator";
import Notes from "components/Notes";
import Actions from "components/Actions";


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
            <Grid />
            <DetailView />
            <Paginator />
          </Route>

          <Route path="/browse/:sourceId/:tableName" exact>
            <ColumnSelector />
            <FilterEditor />
            <OrderEditor />
            <Actions />
            <Grid />
            <Paginator />
          </Route>

          <Route path="/funnel" exact>
            <ColumnSelector />
            <FilterEditor />
            <OrderEditor />
            <Actions />
            {/* <Grid /> */}
            <Kanban />
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