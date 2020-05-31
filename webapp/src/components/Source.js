import React, { useEffect, Fragment, useState } from "react";
import { connect } from "react-redux";

import { Section, Panel } from "components/BulmaHelpers";
import { fetchSource } from "services/source/actions";
import TableList from "components/TableList";


const Source = ({source, fetchSource}) => {
  useEffect(() => {
    fetchSource();
  }, [fetchSource]);
  const [ state, setState ] = useState({
    sourceIndex: null,
  });
  const { sourceIndex } = state;

  const SourceItem = ({source, i, sourceType}) => {
    if (source.properties["is_system_db"]) {
      // This is hackish, we need this since we use the index of source as in response from API
      // Todo: Remove this in [ch161] when moving to source label
      return null;
    }
    const handleClickSource = event => {
      event.preventDefault();
      setState(state => ({
        ...state,
        sourceIndex: i,
      }));
    };

    return (
      <Fragment>
        <div className="panel-block" onClick={handleClickSource}>
          <strong>{source.label}</strong>&nbsp;<span className="tag is-info is-light">{source.provider}</span>
        </div>

        {sourceIndex === i ? <TableList sourceIndex={sourceIndex} sourceType={sourceType} /> : null}
      </Fragment>
    );
  }
  const count_database = source.isReady ? source.rows.filter(x => x.type === "database").length : 0;

  return (
    <Section>
      <Panel title="Databases">
        {source.isReady ? source.rows.filter(x => x.type === "database").map((source, i) => (
          <SourceItem source={source} i={i} sourceType="database" key={`sr-${i}`} />
        )) : null}
      </Panel>

      <Panel title="Services">
        {source.isReady ? source.rows.filter(x => x.type === "service").map((s, i) => (
          <SourceItem s={s} i={count_database + i} sourceType="service" key={`sr-${count_database + i}`} />
        )) : null}
      </Panel>
    </Section>
  );
}


const mapStateToProps = state => ({
  source: state.source,
});


export default connect(
  mapStateToProps,
  { fetchSource }
)(Source);