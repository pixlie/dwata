import React, { useEffect, Fragment } from "react";

import useSource from "services/source/store";
import { Panel } from "components/LayoutHelpers";
import TableList from "components/TableList";

const SourceItem = ({ source, sourceType }) => {
  if (source.properties["is_system_db"]) {
    return null;
  }
  /* const handleClickSource = (event) => {
      event.preventDefault();
      setState((state) => ({
        ...state,
        sourceIndex: source.label,
      }));
    }; */

  return (
    <Fragment>
      <div className="block p-2 pl-3 border-b">
        <strong>{source.label}</strong>&nbsp;
        <span className="inline-block bg-green-200 text-sm px-2 rounded">
          {source.provider}
        </span>
      </div>

      <TableList sourceLabel={source.label} sourceType={sourceType} />
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

  return (
    <Fragment>
      <Panel title="Databases">
        {isReady
          ? sourceRows
              .filter((x) => x.type === "database")
              .map((source) => (
                <SourceItem
                  source={source}
                  sourceType="database"
                  key={`sr-${source.label}`}
                />
              ))
          : null}
      </Panel>

      {/* <Panel title="Services">
        {sourceList.isReady ? sourceList.rows.filter(x => x.type === "service").map((s, i) => (
          <SourceItem s={s} i={count_database + i} sourceType="service" key={`sr-${count_database + i}`} />
        )) : null}
      </Panel> */}
    </Fragment>
  );
};
