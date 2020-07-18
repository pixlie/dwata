import React, { Fragment } from "react";
import { v4 as uuidv4 } from "uuid";

import { useQuerySpecification, useQueryContext } from "services/store";
import Source from "components/Source";
import SavedQuerySpecifications from "components/SavedQuerySpecifications";
import * as globalConstants from "services/global/constants";
import { Hero, Hx, Section, Button } from "components/LayoutHelpers";

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
      select: ["dwata_meta_report"],
      where: {
        "dwata_meta_report.id": item ? item.id : undefined,
      },
      fetchNeeded: true,
    });
  };

  return (
    <Button size="large" attributes={{ onClick: handleClick }}>
      New Report
    </Button>
  );
};

export default () => {
  return (
    <Fragment>
      <div className="flex items-stretch">
        <div className="flex-1 px-2">
          <Hx x="2">travlyng</Hx>
          <Source />
        </div>

        <div className="flex-1 px-2">
          <SavedQuerySpecifications context={{ key: uuidv4() }} />
        </div>

        <div className="flex-1 px-2">
          <Hx x="3">Reports</Hx>

          <ReportItem />
        </div>
      </div>
    </Fragment>
  );
};
