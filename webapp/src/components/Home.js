import React, { Fragment } from "react";

import { Hero, Hx } from "components/BulmaHelpers";


export default () => (
  <Fragment>
    <Hero size="is-fullheight" textCentered={true}>
      <Hx x="1">Welcome to dwata</Hx>
      <Hx x="4" titleClass="subtitle">Let's have an awesome time!</Hx>
    </Hero>
  </Fragment>
);