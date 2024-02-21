import React, { useRef, Fragment } from "react";

import { useGlobal } from "services/store";
import { Button } from "components/LayoutHelpers";

const guideText = {
  source: (
    <span className="block text-sm font-medium my-2 w-64">
      These tables are in the database that is configured. Click on any to see
      the data inside.
    </span>
  ),
  gridHead: (
    <span className="block text-sm font-medium my-2 w-64">
      The grid shows data with columns you want to see and filters applied.
      Single records can be seen with all their details.
    </span>
  ),
  relatedButton: (
    <span className="block text-sm font-medium my-2 w-64">
      Tables that are related are automatically found for you. When you add
      them, they are either merged or embedded (multiple records per record of
      parent).
    </span>
  ),
  notesButton: (
    <span className="block text-sm font-medium my-2 w-64">
      You can save notes about any data or custom queries/KPIs here. Makes it
      easy to document business process and onboard team members.
    </span>
  ),
  tableHead: (
    <span className="block text-sm font-medium my-2 w-64">
      You may order or filter the data with any column. Some data types are not
      yet supported (coming soon).
    </span>
  ),
  expandButton: (
    <span className="block text-sm font-medium my-2 w-64">
      For each row of the parent, there many be many of the embedded data, you
      may expand them per row as you need.
    </span>
  ),
};

function ProductGuide({ guideFor }) {
  const setActiveProductGuideFor = useGlobal(
    (state) => state.setActiveProductGuideFor
  );
  const showProductGuideFor = useGlobal((state) => state.showProductGuideFor);
  const pingRef = useRef(null);
  const handleClick = () => {
    setActiveProductGuideFor(
      showProductGuideFor === guideFor ? null : guideFor
    );
  };

  const Ping = () => (
    <span
      className="absolute"
      style={{
        top: "2px",
        right: "12px",
      }}
      ref={pingRef}
    >
      <span className="absolute block animate-ping bg-blue-500 rounded-lg w-3 h-3"></span>
      <span
        className="absolute block bg-blue-500 rounded-lg shadow-lg w-3 h-3 cursor-pointer"
        onClick={handleClick}
      ></span>
    </span>
  );

  const Guide = () => {
    const pos = pingRef.current.getBoundingClientRect();

    return (
      <span
        className="fixed bg-white shadow-lg border rounded-lg px-3 py-2 max-w-sm"
        style={{
          top: `${pos.top}px`,
          left: `${pos.left > 300 ? pos.left - 145 : 10}px`,
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
      </span>
    );
  };

  return (
    <Fragment>
      {showProductGuideFor === guideFor ? <Guide /> : null}
      {showProductGuideFor === null ? <Ping /> : null}
    </Fragment>
  );
}

export default ProductGuide;
