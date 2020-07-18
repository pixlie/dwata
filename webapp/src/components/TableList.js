import React, { useEffect, Fragment } from "react";

import {
  useSchema,
  useQueryContext,
  useQuerySpecification,
} from "services/store";
import * as globalConstants from "services/global/constants";

const BrowserItem = ({ item, sourceLabel, sourceType }) => {
  const initiateQuerySpecification = useQuerySpecification(
    (state) => state.initiateQuerySpecification
  );
  const setContext = useQueryContext((state) => state.setContext);
  const urlBase = sourceType === "database" ? "/browse" : "/service";

  const handleClick = (event) => {
    event.preventDefault();
    initiateQuerySpecification("main", {
      sourceLabel,
      select: [item.table_name],
      fetchNeeded: true,
    });
    setContext("main", {
      appType: globalConstants.APP_NAME_BROWSER,
    });
  };

  return (
    <a
      className="block p-1 pl-6 border-b hover:bg-gray-100"
      href={`${urlBase}/${sourceLabel}/${item.table_name}`}
      onClick={handleClick}
    >
      {item.table_name}
    </a>
  );
};

export default ({ sourceLabel, sourceType }) => {
  const schema = useSchema((state) => state[sourceLabel]);
  const fetchSchema = useSchema((state) => state.fetchSchema);
  useEffect(() => {
    fetchSchema(sourceLabel);
  }, [sourceLabel, fetchSchema]);

  return (
    <Fragment>
      {!!schema && schema.isReady
        ? schema.rows
            .filter((s) => s.properties.is_system_table === false)
            .map((s, i) => (
              <BrowserItem
                key={`sr-${i}`}
                item={s}
                sourceLabel={sourceLabel}
                sourceType={sourceType}
              />
            ))
        : null}
      <div className="block p-2 pl-3 border-b">
        <i>System tables</i>
      </div>
      {!!schema && schema.isReady
        ? schema.rows
            .filter((s) => s.properties.is_system_table === true)
            .map((s, i) => (
              <BrowserItem
                key={`sr-${i}`}
                item={s}
                sourceLabel={sourceLabel}
                sourceType={sourceType}
              />
            ))
        : null}
    </Fragment>
  );
};
