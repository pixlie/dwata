import React  from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import Navbar from "components/Navbar";
import Home from "components/Home";
import Pricing from "components/Pricing";
// import Features from "components/Features";
import Blog from "components/Blog";


export default () => (
  <BrowserRouter>
    <Navbar />

    <Route path="/" render={({location}) => {
      if (typeof window.ga === "function") {
        window.ga("set", "page", location.pathname + location.search);
        window.ga("send", "pageview");
      }
      return null;
    }} />

    <Switch>
      <Route path="/" exact>
        <Home />
      </Route>

      {/* <Route path="/features" exact>
        <Features />
      </Route> */}

      <Route path="/pricing" exact>
        <Pricing />
      </Route>

      <Route path="/blog">
        <Blog />
      </Route>
    </Switch>
  </BrowserRouter>
);