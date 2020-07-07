import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import { transformData } from "utils";
import { Panel } from "components/BulmaHelpers";
import { fetchSavedQuery } from "services/apps/actions";
import { getSavedQuery } from "services/apps/getters";

const SavedQuerySpecifications = ({
  appsIsReady,
  savedQuerySpecificationList,
  fetchSavedQuery,
}) => {
  useEffect(() => {
    appsIsReady && fetchSavedQuery();
  }, [appsIsReady, fetchSavedQuery]);

  if (!appsIsReady) {
    return null;
  }

  return (
    <Panel title="Saved Queries">
      {savedQuerySpecificationList.isReady
        ? savedQuerySpecificationList.rows.map((sQS, i) => (
            <Link
              className="panel-block"
              to={`/saved/${sQS.id}`}
              key={`sr-${i}`}
            >
              <span className="tag is-light is-info">#{sQS.id}</span>&nbsp;
              {sQS.label}
            </Link>
          ))
        : null}
    </Panel>
  );
};

const mapStateToProps = (state) => {
  const appsIsReady = state.apps.isReady;
  if (!appsIsReady) {
    return {
      appsIsReady,
    };
  }
  const savedQuerySpecificationList = getSavedQuery(state);

  return {
    appsIsReady,
    savedQuerySpecificationList:
      savedQuerySpecificationList.isReady === true
        ? {
            ...savedQuerySpecificationList,
            rows: [...savedQuerySpecificationList.rows].map((row) =>
              transformData(savedQuerySpecificationList.columns, row)
            ),
          }
        : savedQuerySpecificationList,
  };
};

export default connect(mapStateToProps, { fetchSavedQuery })(
  SavedQuerySpecifications
);
