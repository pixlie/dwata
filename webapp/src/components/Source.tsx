import { useState, useEffect } from "react";

import useSource from "stores/source";
import TableList from "components/TableList";
import { ISource } from "utils/types";

interface IPropTypes {
  source: ISource;
  index: number;
}

const SourceItem = ({ source, index }: IPropTypes) => {
  const [state, setState] = useState({
    isOpen: true,
  });

  const handleClickSource = () => {
    setState((state) => ({
      ...state,
      isOpen: !state.isOpen,
    }));
  };

  return (
    <>
      <div className="relative">
        <div
          className="block p-2 pl-3 border-b cursor-pointer"
          onClick={handleClickSource}
        >
          {source.type === "database" ? (
            <span className="text-lg text-gray-600 text-center mr-3">
              <i className="fas fa-database" />
            </span>
          ) : null}
          <span className="font-semibold tracking-wide">{source.label}</span>
          &nbsp;
          <span className="inline-block bg-green-200 text-sm px-2 rounded">
            {source.provider}
          </span>
        </div>
      </div>

      {state.isOpen ? (
        <TableList sourceLabel={source.label} sourceType={source.type} />
      ) : null}
    </>
  );
};

function Source(): JSX.Element {
  const isReady = useSource((state) => state.isReady);
  const sourceRows = useSource((state) => state.rows);
  const fetchSource = useSource((state) => state.fetchSource);
  useEffect(() => {
    fetchSource();
  }, [fetchSource]);
  /* const [state, setState] = useState({
    sourceIndex: null,
  }); */
  // const {sourceIndex} = state;

  if (!isReady) {
    return <></>;
  }

  return (
    <>
      {/* <div className="block p-2 pl-3 border-b">
        <span className="text-lg text-yellow-200 text-center mr-3">
          <i className="fas fa-star" />
        </span>
        <span className="font-semibold text-gray-500">Starred</span>
      </div>
      <div className="block p-2 pl-3 border-b">
        <span className="text-lg text-orange-200 text-center mr-3">
          <i className="fas fa-folder" />
        </span>
        <span className="font-semibold text-gray-500">Orders</span>
      </div>
      <div className="block p-2 pl-3 border-b">
        <span className="text-lg text-gray-200 text-center mr-3">
          <i className="fas fa-folder" />
        </span>
        <span className="font-semibold text-gray-500">Customers</span>
      </div> */}

      {sourceRows
        .filter((x) => x.type === "database")
        .map((source, i) => (
          <SourceItem
            key={`sr-${source.label}`}
            index={i}
            source={source}
            sourceType={source.type}
          />
        ))}

      {/* <Panel title="Services">
        {sourceList.isReady ? sourceList.rows.filter(x => x.type === "service").map((s, i) => (
          <SourceItem s={s} i={count_database + i} sourceType="service" key={`sr-${count_database + i}`} />
        )) : null}
      </Panel> */}
    </>
  );
}

export default Source;
