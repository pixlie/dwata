import React, { useEffect, Fragment } from "react";

import { useSchema, useGlobal, useQueryContext } from "services/store";
import * as globalConstants from "services/global/constants";

export default ({ sourceLabel, sourceType }) => {
  const schema = useSchema((state) => state.inner[sourceLabel]);
  const fetchSchema = useSchema((state) => state.fetchSchema);
  useEffect(() => {
    fetchSchema(sourceLabel);
  }, [sourceLabel, fetchSchema]);
  const setMainApp = useGlobal((state) => state.setMainApp);
  const setContext = useQueryContext((state) => state.setContext);
  const urlBase = sourceType === "database" ? "/browse" : "/service";

  const BrowserItem = ({ item }) => {
    const handleClick = (event) => {
      event.preventDefault();
      setMainApp(globalConstants.APP_NAME_BROWSER);
      setContext("main", {
        sourceLabel,
        tableName: item.table_name,
      });
    };

    return (
      <a
        className="panel-block"
        href={`${urlBase}/${sourceLabel}/${item.table_name}`}
        onClick={handleClick}
      >
        &nbsp;&nbsp;&nbsp;&nbsp; {item.table_name}
      </a>
    );
  };

  return (
    <Fragment>
      {!!schema && schema.isReady
        ? schema.rows
            .filter((s) => s.properties.is_system_table === false)
            .map((s, i) => <BrowserItem key={`sr-${i}`} item={s} />)
        : null}
      <div className="panel-block">
        <i>System tables</i>
      </div>
      {!!schema && schema.isReady
        ? schema.rows
            .filter((s) => s.properties.is_system_table === true)
            .map((s, i) => <BrowserItem key={`sr-${i}`} item={s} />)
        : null}
    </Fragment>
  );
};
