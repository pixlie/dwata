/* @refresh reload */
import { render } from "solid-js/web";
import { Router, Route } from "@solidjs/router";

import "./index.css";
import App from "./App";

render(
  () => <Router root={App}></Router>,
  document.getElementById("root") as HTMLElement
);
