import React, { Fragment } from "react";

import { QueryContext } from "utils";
import { useGlobal, useQueryContext } from "services/store";
import * as globalConstants from "services/global/constants";
import Navbar from "components/Navbar";
// import Source from "components/Source";
// import Sidebar from "components/Sidebar";
import Home from "components/Home";
import Grid from "components/Grid";
// import DetailView from "components/Detail";
// import Funnel from "components/Funnel";
// import APIBrowser from "components/APIBrowser";
import ColumnSelector from "components/QueryEditor/ColumnSelector";
// import FilterEditor from "components/QueryEditor/FilterEditor";
// import OrderEditor from "components/QueryEditor/OrderEditor";
import Paginator from "components/QueryEditor/Paginator";
// import Notes from "components/Notes";
// import Actions from "components/Actions";
// import Report from "components/Report";

export default () => {
  const mainApp = useGlobal((state) => state.inner.mainApp);
  const queryContext = useQueryContext((state) => state.inner["main"]);

  return (
    <Fragment>
      <QueryContext.Provider value={queryContext}>
        <Navbar />
      </QueryContext.Provider>
      {/* <Notes /> */}
      {/* <Sidebar><Source /></Sidebar> */}

      {mainApp === globalConstants.APP_NAME_BROWSER ? (
        <QueryContext.Provider value={queryContext}>
          <Grid />
          <ColumnSelector />
          {/* <FilterEditor />
          <OrderEditor />
          <Actions /> */}
          <Paginator />
        </QueryContext.Provider>
      ) : null}

      {/*<Route path="/browse/:sourceId/:tableName/:pk" exact>
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
      </Route>{" "}
      */}
      {/* <Route path="/funnel" exact>
            <ColumnSelector />
            <FilterEditor />
            <OrderEditor />
            <Actions />
            <Funnel />
            <Paginator />
          </Route> */}
      {/* <Route path="/service/:sourceId/:resourceName" exact>
            <APIBrowser />
          </Route>

          <Route path="/report/create" exact>
            <Report />
          </Route>

          <Route path="/report/:reportId" exact>
            <Report />
        </Route> */}
      {mainApp === globalConstants.APP_NAME_HOME ? <Home /> : null}
    </Fragment>
  );
};
