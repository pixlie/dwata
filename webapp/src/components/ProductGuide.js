import React, { useState, Fragment } from "react";

import { useQueryContext, useProductGuide } from "services/store";
import * as globalConstants from "services/global/constants";
import { set } from "lodash";

const guideText = {
  source: (
    <div>These are the tables that are in the database that is configured.</div>
  ),
};

const Ping = ({ guideFor, position }) => {
  const [state, setState] = useState({
    active: false,
  });
  const handleClick = () => {
    setState({
      active: true,
    });
  };

  return (
    <Fragment>
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
      {state.active ? (
        <div
          className="fixed w-64 bg-white shadow-lg rounded-lg p-4"
          style={{
            top: `${position.top + 2}px`,
            left: `${position.left + position.width - 18}px`,
          }}
        >
          {guideText[guideFor]}
        </div>
      ) : null}
    </Fragment>
  );
};

export default () => {
  const mainApp = useQueryContext((state) => state["main"]);
  const source = useProductGuide((state) => state.source);

  if (mainApp && mainApp.appType === globalConstants.APP_NAME_HOME) {
    if ("top" in source) {
      return <Ping guideFor="source" position={source} />;
    }
  }
  return null;
};
