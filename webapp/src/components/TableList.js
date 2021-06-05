import { useEffect, Fragment } from "react";
import { useHistory } from "react-router-dom";

import {
  useSchema,
  useQueryContext,
  useQuerySpecification,
} from "services/store";
import * as globalConstants from "services/global/constants";
import { Hx } from "components/LayoutHelpers";

function TableItem({ item, sourceLabel }) {
  const initiateQuerySpecification = useQuerySpecification(
    (state) => state.initiateQuerySpecification
  );
  const history = useHistory();
  const setContext = useQueryContext((state) => state.setContext);

  const handleClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    // We set the query specification of the "main" app here to
    //  select data for the source and table that is clicked
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
    history.push("/explore/");
  };

  return (
    <div
      className="block w-full py-1 border-b cursor-pointer hover:bg-gray-200"
      onClick={handleClick}
    >
      <span className="text-sm text-gray-600 text-center ml-6 mr-3">
        <a href="/explore/" onClick={handleClick}>
          <i className="fas fa-table" />
        </a>
      </span>
      <span className="text-xs font-medium tracking-normal text-blue-700">
        <a href="/explore/" onClick={handleClick}>
          {item.table_name}
        </a>
      </span>
    </div>
  );
}

function TableList({ sourceLabel, sourceType }) {
  const schema = useSchema((state) => state[sourceLabel]);
  const fetchSchema = useSchema((state) => state.fetchSchema);
  useEffect(() => {
    fetchSchema(sourceLabel);
  }, [sourceLabel, fetchSchema]);

  if (!schema || !schema.isReady) {
    return null;
  }

  return (
    <Fragment>
      {schema.rows
        .filter((s) => s.properties.is_system_table === false)
        .map((s, i) => (
          <TableItem
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
            <TableItem
              key={`sr-${i}`}
              item={s}
              sourceLabel={sourceLabel}
              sourceType={sourceType}
            />
          ))}
      </div>
    </Fragment>
  );
}

export default TableList;
