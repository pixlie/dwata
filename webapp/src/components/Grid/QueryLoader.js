import React, { useEffect } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { getQueryDetails } from "services/browser/getters";
import { fetchSchema } from "services/schema/actions";
import { fetchData } from "services/browser/actions";

const QueryLoader = ({ sourceId, tableName, fetchSchema, fetchData }) => {
  // We made this small separate component just for the separate useEffect used here
  useEffect(() => {
    if (!!sourceId) {
      fetchSchema(sourceId);
      fetchData();
    }
  }, [sourceId, tableName, fetchSchema, fetchData]);

  return <div>Loading data...</div>;
};

const mapStateToProps = (state, props) => {
  const { sourceId } = getQueryDetails(state, props);

  return {
    sourceId,
  };
};

export default withRouter(
  connect(mapStateToProps, {
    fetchData,
    fetchSchema,
  })(QueryLoader)
);
