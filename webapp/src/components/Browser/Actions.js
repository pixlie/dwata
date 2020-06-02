import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { Section, Hx } from "components/BulmaHelpers";
import { pinRecords } from "services/apps/actions";


const Actions = ({isReady, isVisible, selectedRowList, pinRecords}) => {
  if (!isReady || !isVisible) {
    return null;
  }
  const handlePinRecords = event => {
    event.preventDefault();
    pinRecords();
  }

  return (
    <div id="actions-modal">
      <Section>
        <Hx x="4">Bulk actions</Hx>
        {selectedRowList.length > 0 ? (
          <p className="tag is-light is-medium">{selectedRowList.length} records are selected</p>
        ) : null}
        <button className="button is-fullwidth is-success" onClick={handlePinRecords}>Pin them</button>
      </Section>
    </div>
  );
}


const mapStateToProps = (state, props) => {
  let { sourceId, tableName } = props.match.params;
  sourceId = parseInt(sourceId);
  const _browserCacheKey = `${sourceId}/${tableName}`;
  let isReady = false;
  if (state.schema.isReady && state.schema.sourceId === parseInt(sourceId) &&
    state.browser.isReady && state.browser._cacheKey === _browserCacheKey &&
    state.querySpecification.isReady && state.querySpecification._cacheKey === _browserCacheKey) {
    isReady = true;
  }

  if (isReady) {
    return {
      isReady,
      sourceId,
      tableName,
      isVisible: state.global.isActionsVisible,
      selectedRowList: state.browser.selectedRowList,
    };
  } else {
    return {
      isReady,
    };
  }
}


export default withRouter(connect(
  mapStateToProps,
  {
    pinRecords,
  }
)(Actions));