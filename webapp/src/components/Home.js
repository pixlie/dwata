import React, { Fragment } from "react";

import { useQuerySpecification, useQueryContext } from "services/store";
import Source from "components/Source";
import SavedQuerySpecifications from "components/SavedQuerySpecifications";
import * as globalConstants from "services/global/constants";
import { Hx, Button } from "components/LayoutHelpers";

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
      select: [
        {
          label: "dwata_meta_report",
          tableName: "dwata_meta_report",
        },
      ],
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
        <div className="flex-1 max-w-sm border-r border-gray-300">
          <Hx x="3">Browse</Hx>
          <Source />
        </div>

        <div className="flex-1 bg-gray-100">
          <Hx x="3">Recent activity</Hx>
          {/* <SavedQuerySpecifications context={{ key: "saved_queries" }} /> */}
        </div>

        <div className="flex-1 max-w-sm bg-gray-100">
          <Hx x="3">Saved queries, reports</Hx>
          <ReportItem />
        </div>
      </div>
    </Fragment>
  );
};
