import React, { Fragment } from "react";
import { v4 as uuidv4 } from "uuid";

import { useQuerySpecification, useQueryContext } from "services/store";
import Source from "components/Source";
import SavedQuerySpecifications from "components/SavedQuerySpecifications";
import * as globalConstants from "services/global/constants";
import { Hero, Hx, Section } from "components/BulmaHelpers";

const ReportItem = ({ item }) => {
  const initiateQuerySpecification = useQuerySpecification(
    (state) => state.initiateQuerySpecification
  );
  const setContext = useQueryContext((state) => state.setContext);

  const handleClick = (event) => {
    event.preventDefault();
    setContext("main", {
      appType: globalConstants.APP_NAME_REPORT,
    });
    initiateQuerySpecification("main", {
      sourceLabel: "dwata_meta",
      tableName: "dwata_meta_report",
      pk: item.id,
      isSavedQuery: true,
      fetchNeeded: true,
    });
  };

  return (
    <a
      href="/report/create"
      className="button is-success is-medium"
      onClick={handleClick}
    >
      New Report
    </a>
  );
};

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
            <SavedQuerySpecifications context={{ key: uuidv4() }} />
          </div>
          <div className="column is-4">
            <Hx x="3">Reports</Hx>

            <ReportItem />
          </div>
        </div>
      </Section>
    </Fragment>
  );
};
