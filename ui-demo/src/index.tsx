/* @refresh reload */
import { render } from "solid-js/web";
import { Router, Route } from "@solidjs/router";

import "./index.css";
import App from "./App";
import Home from "./routes/Home";
import Browse from "./routes/Browse";
import { SettingsWrapper, SettingsRoutes } from "./routes/Settings";

render(
  () => (
    <Router root={App}>
      <Route path={"/browse/:sourceTables"} component={Browse} />
      <Route path={"/settings"} component={SettingsWrapper}>
        <SettingsRoutes />
      </Route>
      <Route path={"/"} component={Home} />
    </Router>
  ),
  document.getElementById("root") as HTMLElement
);
