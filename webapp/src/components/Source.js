import React, { useEffect, Fragment, useState } from "react";
import { connect } from "react-redux";

import { Section, Panel, Hx } from "components/BulmaHelpers";
import { fetchSource } from "services/source/actions";
import TableList from "components/TableList";


const Source = ({ source, fetchSource }) => {
  useEffect(() => {
    fetchSource();
  }, []);
  const [ state, setState ] = useState({
    sourceIndex: null,
  });
  const { sourceIndex } = state;

  const SourceItem = ({ s, i, sourceType }) => {
    const handleClickSource = event => {
      event.preventDefault();
      setState({
        ...state,
        sourceIndex: i,
      });
    };

    return (
      <Fragment>
        <div className="panel-block" onClick={handleClickSource}>
          <strong>{s.label}</strong>&nbsp;<span className="tag is-info is-light">{s.provider}</span>
        </div>

        { sourceIndex === i ? <TableList sourceIndex={sourceIndex} sourceType={sourceType} /> : null }
      </Fragment>
    );
  }
  const count_database = source.isReady ? source.rows.filter(x => x.type === "database").length : 0;

  return (
    <Section>
      <Panel title="Databases">
        { source.isReady ? source.rows.filter(x => x.type === "database").map((s, i) => (
          <SourceItem s={s} i={i} sourceType="database" key={`sr-${i}`} />
        )) : null }
      </Panel>

      <Panel title="Services">
        { source.isReady ? source.rows.filter(x => x.type === "service").map((s, i) => (
          <SourceItem s={s} i={count_database + i} sourceType="service" key={`sr-${count_database + i}`} />
        )) : null }
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