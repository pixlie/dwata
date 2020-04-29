import React, { useEffect, Fragment, useState } from "react";
import { Link } from "react-router-dom";
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
  const SourceItem = ({ s, i }) => {
    const handleClickSource = event => {
      event.preventDefault();
      setState({
        ...state,
        sourceIndex: i,
      });
    };

    return (
      <Fragment>
        <div className="panel-block" to={`/browse/${i}`} onClick={handleClickSource}>
          {s.label}&nbsp;<span className="tag is-info is-light">{s.engine}</span>
        </div>

        { sourceIndex === i ? <TableList sourceIndex={sourceIndex} /> : null }
      </Fragment>
    );
  }

  return (
    <Section>
      <Panel title="Select a database">
        { source.isReady ? source.rows.map((s, i) => (
          <SourceItem s={s} i={i} key={`sr-${i}`} />
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