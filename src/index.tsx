/* @refresh reload */
import { render } from "solid-js/web";
import { Router, Route } from "@solidjs/router";

import "./index.css";
import App from "./App";
import Home from "./routes/Home";
import QueryBrowser from "./routes/QueryBrowser";
import { SettingsWrapper, SettingsRoutes } from "./routes/Settings";
import UserAccount from "./routes/UserAccount";
import { ChatRoutes, ChatWrapper } from "./routes/Chat";
import FolderBrowser from "./routes/FolderBrowser";

render(
  () => (
    <Router root={App}>
      <Route path={"/browse"} component={QueryBrowser} />
      <Route path="/directory" component={FolderBrowser} />
      <Route path={"/settings"} component={SettingsWrapper}>
        <SettingsRoutes />
      </Route>
      <Route path={"/user"} component={UserAccount} />
      <Route path={"/"} component={Home} />
      <Route path={"/chat"} component={ChatWrapper}>
        <ChatRoutes />
      </Route>
    </Router>
  ),
  document.getElementById("root") as HTMLElement
);
