import React, { useEffect, Fragment, useState } from "react";

import useSource from "services/source/store";
import { Panel } from "components/BulmaHelpers";
import TableList from "components/TableList";

export default () => {
  const fetchSource = useSource((state) => state.fetchSource);
  useEffect(() => {
    fetchSource();
  }, [fetchSource]);
  const isReady = useSource((state) => state.isReady);
  const sourceRows = useSource((state) => state.rows);
  const [state, setState] = useState({
    sourceIndex: null,
  });
  // const {sourceIndex} = state;

  const SourceItem = ({ source, sourceType }) => {
    if (source.properties["is_system_db"]) {
      // This is hackish, we need this since we use the index of source as in response from API
      // Todo: Remove this in [ch161] when moving to source label
      return null;
    }
    const handleClickSource = (event) => {
      event.preventDefault();
      setState((state) => ({
        ...state,
        sourceIndex: source.label,
      }));
    };

    return (
      <Fragment>
        <div className="panel-block" onClick={handleClickSource}>
          <strong>{source.label}</strong>&nbsp;
          <span className="tag is-info is-light">{source.provider}</span>
        </div>

        <TableList sourceLabel={source.label} sourceType={sourceType} />
      </Fragment>
    );
  };

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

// const mapStateToProps = (state) => ({
//   sourceList: state.source,
// });

// export default connect(mapStateToProps, { fetchSource })(Source);
