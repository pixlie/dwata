import React, { useEffect } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { getQueryDetails } from "services/browser/getters";
import { withQueryDetails } from "utils";
import { fetchData, toggleRowSelection } from "services/browser/actions";
import { fetchPins, fetchSavedQuery } from "services/apps/actions";
import { fetchSchema } from "services/schema/actions";

const SavedQueryLoader = ({
  savedQueryId,
  savedQuery,
  fetchSchema,
  fetchData,
  fetchSavedQuery,
}) => {
  // We made this small separate component just for the separate useEffect used here
  useEffect(() => {
    if (!!savedQueryId && !savedQuery) {
      fetchSavedQuery(savedQueryId);
    }

    if (!!savedQueryId && !!savedQuery && "source_id" in savedQuery) {
      fetchSchema(parseInt(savedQuery.source_id));
      fetchData(savedQuery);
    }
  }, [savedQueryId, savedQuery, fetchSchema, fetchData, fetchSavedQuery]);

  return <div>Loading data for Saved Query...</div>;
};

const mapStateToProps = (state, props) => {
  const { savedQueryId, savedQuery } = getQueryDetails(state, props);

  return {
    savedQueryId,
    savedQuery,
  };
};

export default withRouter(
  withQueryDetails(
    connect(mapStateToProps, {
      fetchData,
      fetchSchema,
      toggleRowSelection,
      fetchPins,
      fetchSavedQuery,
    })(SavedQueryLoader)
  )
);
