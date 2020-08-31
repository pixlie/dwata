import React, { useState, useEffect, Fragment, useRef } from "react";

import { useSource } from "services/store";
import TableList from "components/TableList";
import ProductGuide from "components/ProductGuide";

const SourceItem = ({ source, sourceType, index }) => {
  const [state, setState] = useState({
    isOpen: true,
    productGuidePingPosition: null,
  });
  const firstSourceRef = useRef(null);
  useEffect(() => {
    firstSourceRef.current &&
      index === 0 &&
      setState({
        productGuidePingPosition: firstSourceRef.current.getBoundingClientRect(),
      });
  }, []);

  if (source.properties["is_system_db"]) {
    return null;
  }
  const handleClickSource = () => {
    setState((state) => ({
      ...state,
      isOpen: !state.isOpen,
    }));
  };

  return (
    <Fragment>
      <div className="relative" ref={firstSourceRef}>
        <div
          className="block p-2 pl-3 border-b cursor-default"
          onClick={handleClickSource}
        >
          {sourceType === "database" ? (
            <span className="text-lg text-gray-600 text-center mr-3">
              <i className="fas fa-database" />
            </span>
          ) : null}
          <strong>{source.label}</strong>&nbsp;
          <span className="inline-block bg-green-200 text-sm px-2 rounded">
            {source.provider}
          </span>
        </div>
        {state.productGuidePingPosition ? (
          <ProductGuide guideFor="source" />
        ) : null}
      </div>

      {state.isOpen ? (
        <TableList sourceLabel={source.label} sourceType={sourceType} />
      ) : null}
    </Fragment>
  );
};

export default () => {
  const isReady = useSource((state) => state.isReady);
  const sourceRows = useSource((state) => state.rows);
  const fetchSource = useSource((state) => state.fetchSource);
  useEffect(() => {
    fetchSource();
  }, []);
  /* const [state, setState] = useState({
    sourceIndex: null,
  }); */
  // const {sourceIndex} = state;

  if (!isReady) {
    return null;
  }

  return (
    <Fragment>
      <div className="block p-2 pl-3 border-b">
        <span className="text-lg text-yellow-200 text-center mr-3">
          <i className="fas fa-star" />
        </span>
        <strong className="text-gray-500">Starred</strong>
      </div>
      <div className="block p-2 pl-3 border-b">
        <span className="text-lg text-orange-200 text-center mr-3">
          <i className="fas fa-folder" />
        </span>
        <strong className="text-gray-500">Orders</strong>
      </div>
      <div className="block p-2 pl-3 border-b">
        <span className="text-lg text-gray-200 text-center mr-3">
          <i className="fas fa-folder" />
        </span>
        <strong className="text-gray-500">Customers</strong>
      </div>

      {sourceRows
        .filter((x) => x.type === "database")
        .map((source, i) => (
          <SourceItem
            key={`sr-${source.label}`}
            index={i}
            source={source}
            sourceType="database"
          />
        ))}

      {/* <Panel title="Services">
        {sourceList.isReady ? sourceList.rows.filter(x => x.type === "service").map((s, i) => (
          <SourceItem s={s} i={count_database + i} sourceType="service" key={`sr-${count_database + i}`} />
        )) : null}
      </Panel> */}
    </Fragment>
  );
};
