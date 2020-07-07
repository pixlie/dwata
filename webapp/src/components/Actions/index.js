import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { getQueryDetails } from "services/browser/getters";
import { Section, Hx } from "components/BulmaHelpers";
import { pinRecords } from "services/apps/actions";

const Actions = ({ isReady, isVisible, selectedRowList, pinRecords }) => {
  if (!isReady || !isVisible) {
    return null;
  }
  const handlePinRecords = (event) => {
    event.preventDefault();
    pinRecords();
  };

  return (
    <div id="actions-modal">
      <Section>
        <Hx x="4">Bulk actions</Hx>
        {selectedRowList.length > 0 ? (
          <p className="tag is-light is-medium">
            {selectedRowList.length} records are selected
          </p>
        ) : null}
        <button
          className="button is-fullwidth is-success"
          onClick={handlePinRecords}
        >
          Pin them
        </button>
      </Section>
    </div>
  );
};

const mapStateToProps = (state, props) => {
  const { cacheKey, sourceId, tableName } = getQueryDetails(state, props);

  if (
    state.schema.isReady &&
    state.schema.sourceId === sourceId &&
    state.browser.isReady &&
    state.browser.cacheKey === cacheKey &&
    state.querySpecification.isReady &&
    state.querySpecification.cacheKey === cacheKey
  ) {
    return {
      isReady: true,
      sourceId,
      tableName,
      isVisible: state.global.isActionsVisible,
      selectedRowList: state.browser.selectedRowList,
    };
  }

  return {
    isReady: false,
  };
};

export default withRouter(
  connect(mapStateToProps, {
    pinRecords,
  })(Actions)
);
