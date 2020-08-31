import React, { useState, Fragment } from "react";

import { useQueryContext, useProductGuide } from "services/store";
import * as globalConstants from "services/global/constants";
import { Hx, Button } from "components/LayoutHelpers";

const guideText = {
  source: (
    <div className="my-2 w-64">
      These tables are in the database that is configured. Click on any to see
      the data inside.
    </div>
  ),
  gridHead: (
    <div className="my-2 w-64">
      The grid shows data with columns you want to see and filters applied.
      Single records can be seen with all their details.
    </div>
  ),
  relatedButton: (
    <div className="my-2 w-64">
      Tables that are related are automatically found for you. When you add
      them, they are either merged or embedded (multiple records per record of
      parent).
    </div>
  ),
  notesButton: (
    <div className="my-2 w-64">
      You can save notes about any data or custom queries/KPIs directly in{" "}
      <strong>dwata</strong>. Makes it easy to document business process.
    </div>
  ),
  tableHead: (
    <div className="my-2 w-64">
      You may order by any column or filter them from here. Some data types are
      not yet supported (coming soon).
    </div>
  ),
};

const Ping = ({ guideFor, position }) => {
  const [state, setState] = useState({
    active: false,
  });
  const handleClick = () => {
    setState({
      active: !state.active,
    });
  };

  return (
    <Fragment>
      {state.active ? (
        <div
          className="fixed bg-white shadow-lg rounded-lg p-4"
          style={{
            top: `${position.top + 2}px`,
            left: `${position.left + position.width - 18}px`,
          }}
        >
          <Button
            theme="secondary"
            size="sm"
            margin=""
            attributes={{ onClick: handleClick }}
          >
            Close
          </Button>
          {guideText[guideFor]}
        </div>
      ) : (
        <div
          className="fixed"
          style={{
            top: `${position.top + 2}px`,
            left: `${position.left + position.width - 18}px`,
          }}
        >
          <span className="absolute block animate-ping bg-blue-500 rounded-lg w-4 h-4"></span>
          <span
            className="absolute block bg-blue-500 rounded-lg shadow-lg w-4 h-4 cursor-pointer"
            onClick={handleClick}
          ></span>
        </div>
      )}
    </Fragment>
  );
};

export default () => {
  const mainApp = useQueryContext((state) => state["main"]);
  const source = useProductGuide((state) => state.source);
  const gridHead = useProductGuide((state) => state.gridHead);
  const relatedButton = useProductGuide((state) => state.relatedButton);

  const pings = [];
  if (mainApp && mainApp.appType === globalConstants.APP_NAME_HOME) {
    if ("top" in source) {
      pings.push(<Ping key="pg-source" guideFor="source" position={source} />);
    }
  } else if (mainApp && mainApp.appType === globalConstants.APP_NAME_BROWSER) {
    if ("top" in gridHead) {
      pings.push(
        <Ping
          key="pg-gridHead"
          guideFor="gridHead"
          position={{ ...gridHead, width: 50 }}
        />
      );
    }
    if ("top" in relatedButton) {
      pings.push(
        <Ping
          key="pg-relatedButton"
          guideFor="relatedButton"
          position={{ ...relatedButton, width: 10 }}
        />
      );
    }
  }
  return <Fragment>{pings}</Fragment>;
};
