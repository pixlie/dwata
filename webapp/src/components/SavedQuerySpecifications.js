import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import { Panel } from "components/BulmaHelpers";
import { transformData } from "utils";
import { fetchSavedQuerySpecification } from "services/apps/actions";
import { getSavedQuerySpecification } from "services/apps/getters";


const SavedQuerySpecifications = ({appsIsReady, savedQuerySpecificationList, fetchSavedQuerySpecification}) => {
  useEffect(() => {
    appsIsReady && fetchSavedQuerySpecification();
  }, [appsIsReady, fetchSavedQuerySpecification]);

  if (!appsIsReady) {
    return null;
  }

  return (
    <Panel title="Saved Queries">
      {savedQuerySpecificationList.isReady ? savedQuerySpecificationList.rows.map((sQS, i) => (
        <Link className="panel-block" to={`/browse/saved/${sQS.id}`} key={`sr-${i}`}>
          {sQS.label}
        </Link>
      )) : null}
    </Panel>
  );
}


const mapStateToProps = state => {
  const appsIsReady = state.apps.isReady;
  if (!appsIsReady) {
    return {
      appsIsReady,
    };
  }
  const savedQuerySpecificationList = getSavedQuerySpecification(state);

  return {
    appsIsReady,
    savedQuerySpecificationList: savedQuerySpecificationList.isReady === true ? {
      ...savedQuerySpecificationList,
      rows: [...savedQuerySpecificationList.rows].map(row => transformData(savedQuerySpecificationList.columns, row)),
    } : savedQuerySpecificationList,
  }
}


export default connect(
  mapStateToProps,
  { fetchSavedQuerySpecification }
)(SavedQuerySpecifications);