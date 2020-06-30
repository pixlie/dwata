import React, { Fragment } from "react";

import { Hero, Hx, Section } from "components/BulmaHelpers";
import Source from "components/Source";
import SavedQuerySpecifications from "components/SavedQuerySpecifications";


export default () => {
  return (
    <Fragment>
      <Hero textCentered={true}>
        <Hx x="1">Welcome to dwata</Hx>
      </Hero>

      <Section>
        <div className="columns">
          <div className="column is-4">
            <Source />
          </div>
          <div className="column is-4">
            <SavedQuerySpecifications />
          </div>
          <div className="column is-4">
            <Hx x="3">Funnels</Hx>
          </div>
        </div>
      </Section>
    </Fragment>
  );
};