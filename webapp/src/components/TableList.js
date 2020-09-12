import React, { useEffect, Fragment } from "react";

import {
  useSchema,
  useQueryContext,
  useQuerySpecification,
} from "services/store";
import * as globalConstants from "services/global/constants";
import { Hx } from "components/LayoutHelpers";

const BrowserItem = ({ item, sourceLabel, sourceType }) => {
  const initiateQuerySpecification = useQuerySpecification(
    (state) => state.initiateQuerySpecification
  );
  const setContext = useQueryContext((state) => state.setContext);
  // const urlBase = sourceType === "database" ? "/browse" : "/service";

  const handleClick = (event) => {
    event.preventDefault();
    initiateQuerySpecification("main", {
      sourceLabel,
      select: [
        {
          label: item.table_name,
          tableName: item.table_name,
        },
      ],
      fetchNeeded: true,
    });
    setContext("main", {
      appType: globalConstants.APP_NAME_BROWSER,
    });
  };

  return (
    <div
      className="block w-full py-1 border-b cursor-pointer hover:bg-gray-200"
      onClick={handleClick}
    >
      <span className="text-md text-gray-600 text-center ml-6 mr-3">
        <i className="fas fa-table" />
      </span>
      <span className="text-sm font-semibold tracking-normal text-blue-700">
        {item.table_name}
      </span>
    </div>
  );
};

export default ({ sourceLabel, sourceType }) => {
  const schema = useSchema((state) => state[sourceLabel]);
  const fetchSchema = useSchema((state) => state.fetchSchema);
  useEffect(() => {
    fetchSchema(sourceLabel);
  }, [sourceLabel]);

  if (!schema || !schema.isReady) {
    return null;
  }

  return (
    <Fragment>
      {schema.rows
        .filter((s) => s.properties.is_system_table === false)
        .map((s, i) => (
          <BrowserItem
            key={`sr-${i}`}
            item={s}
            sourceLabel={sourceLabel}
            sourceType={sourceType}
          />
        ))}

      <div className="bg-gray-100 pt-4 py-1">
        <Hx x="6">System tables</Hx>
        {schema.rows
          .filter((s) => s.properties.is_system_table === true)
          .map((s, i) => (
            <BrowserItem
              key={`sr-${i}`}
              item={s}
              sourceLabel={sourceLabel}
              sourceType={sourceType}
            />
          ))}
      </div>
    </Fragment>
  );
};
