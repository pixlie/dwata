import React, { Fragment } from "react";

import { Hero, Hx, Section } from "components/BulmaHelpers";
import Source from "components/Source";


export default () => (
  <Fragment>
    <Hero textCentered={true}>
      <Hx x="1">Welcome to dwata</Hx>
    </Hero>

    <Section>
      <div className="columns">
        <div className="column is-4">
          <Hx x="3">Browse</Hx>
          <div style={{backgroundColor: "#ffffff"}}>
            <Source />
          </div>
        </div>
        <div className="column is-4">
          <Hx x="3">Saved Filters</Hx>

        </div>
        <div className="column is-4">
          <Hx x="3">Funnels</Hx>
        </div>
      </div>
    </Section>
  </Fragment>
);