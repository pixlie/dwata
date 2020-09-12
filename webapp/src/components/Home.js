import React from "react";

import { useQuerySpecification, useQueryContext } from "services/store";
import Source from "components/Source";
// import SavedQuerySpecifications from "components/SavedQuerySpecifications";
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

  return <Button attributes={{ onClick: handleClick }}>Add KPI</Button>;
};

const sampleActivityList = [
  {
    created_by: "Sumit D.",
    activity: "created new",
    entity: "Query (Monthly highest grossing items)",
    created_at: "13 hours ago",
  },
  {
    created_by: "Sumit D.",
    activity: "created new",
    entity: "Query (Products that have never sold)",
    created_at: "23 hours ago",
  },
  {
    created_by: "Sumit D.",
    activity: "created new",
    entity: "Report (Monthly Sales)",
    created_at: "25 hours ago",
  },
];

const ActivityBox = ({ created_by, activity, entity, created_at }) => (
  <div className="block p-6 my-2 mr-1 bg-white border border-gray-300 rounded">
    <span className="text-gray-600 mr-1">{created_by}</span>
    <span className="text-gray-700 mr-1">{activity}</span>
    <span className="font-semibold text-gray-700 mr-1">{entity}</span>
    <span className="text-sm text-gray-600">{created_at}</span>
  </div>
);

const KPIBox = ({ value, metric, tags }) => (
  <div className="block p-6 my-2 mr-1 bg-white border border-gray-300 rounded">
    <span className="text-4xl font-semibold mr-4">{value}</span>
    <span className="text-gray-600">{metric}</span>&nbsp;
    {tags.map((x, i) => (
      <span
        key={`kpi-tg-${i}`}
        className="inline-block bg-green-200 text-xs px-2 rounded"
      >
        {x}
      </span>
    ))}
  </div>
);

export default () => {
  return (
    <div className="flex items-stretch">
      <div
        className="flex-1 overflow-y-auto overflow-x-hidden max-w-sm bg-white border-r border-gray-300"
        style={{ height: "calc(100vh - 60px)" }}
      >
        <Hx x="3">Browse</Hx>
        <Source />
      </div>

      <div className="flex-1 px-2">
        <Hx x="3">Recent activity</Hx>
        <div className="bg-yellow-200 m-2 p-2 px-4 text-sm rounded">
          Coming soon
        </div>
        {/* <SavedQuerySpecifications context={{ key: "saved_queries" }} /> */}
        {sampleActivityList.map((x, i) => (
          <ActivityBox key={`ac-${i}`} {...x} />
        ))}
      </div>

      <div className="flex-1 max-w-sm">
        <Hx x="3">KPIs</Hx>
        <div className="bg-yellow-200 m-2 p-2 px-4 text-sm rounded">
          Coming soon
        </div>
        <KPIBox value={39} metric="New Orders" tags={["last 24 hours"]} />
        <KPIBox value={3128} metric="Product views" tags={["last 24 hours"]} />
        <KPIBox value={84} metric="Abandoned carts" tags={["last 24 hours"]} />
        <Button size="large">Add KPI</Button>
      </div>
    </div>
  );
};
