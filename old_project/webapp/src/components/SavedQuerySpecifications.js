import React, { useEffect } from "react";

import { QueryContext, transformData } from "utils";
import {
  useApps,
  useData,
  useQuerySpecification,
  useQueryContext,
} from "services/store";
import * as globalConstants from "services/global/constants";
import { Panel } from "components/LayoutHelpers";
import QueryLoader from "components/Grid/QueryLoader";

const SavedItem = ({ item }) => {
  const initiateQuerySpecification = useQuerySpecification(
    (state) => state.initiateQuerySpecification
  );
  const setContext = useQueryContext((state) => state.setContext);

  const handleClick = (event) => {
    event.preventDefault();
    setContext("main", {
      appType: globalConstants.APP_NAME_BROWSER,
    });
    initiateQuerySpecification("main", {
      sourceLabel: "dwata_meta",
      select: [
        {
          label: "dwata_meta_saved_query",
          tableName: "dwata_meta_saved_query",
        },
      ],
      where: { "dwata_meta_saved_query.id": item.id },
      isSavedQuery: true,
      fetchNeeded: true,
    });
  };

  return (
    <a className="panel-block" href={`/saved/${item.id}`} onClick={handleClick}>
      <span className="tag is-light is-info">#{item.id}</span>&nbsp;
      {item.label}
    </a>
  );
};

export default ({ context }) => {
  const appsIsReady = useApps((state) => state.isReady);
  const initiateQuerySpecification = useQuerySpecification(
    (state) => state.initiateQuerySpecification
  );
  useEffect(() => {
    if (!appsIsReady) {
      return;
    }
    initiateQuerySpecification(context.key, {
      sourceLabel: "dwata_meta",
      select: [
        {
          label: "dwata_meta_saved_query",
          tableName: "dwata_meta_saved_query",
        },
      ],
      fetchNeeded: true,
    });
  }, [appsIsReady, context.key, initiateQuerySpecification]);
  const data = useData((state) => state[context.key]);
  const qs = useQuerySpecification((state) => state[context.key]);

  if (!(appsIsReady && data && data.isReady)) {
    if (qs && qs.sourceLabel) {
      return (
        <QueryContext.Provider value={{ key: context.key }}>
          <QueryLoader />
        </QueryContext.Provider>
      );
    } else {
      return null;
    }
  }
  const rows = [...data.rows].map((row) => transformData(data.columns, row));

  return (
    <QueryContext.Provider value={{ key: context.key }}>
      <Panel title="Saved Queries">
        {rows.map((item, i) => (
          <SavedItem key={`sr-${i}`} item={item} />
        ))}
      </Panel>
    </QueryContext.Provider>
  );
};
