import React, { useEffect } from "react";

import { useQueryContext, useQuerySpecification } from "services/store";
import useSchema from "stores/schema";
import * as globalConstants from "services/global/constants";
import { Hx } from "components/LayoutHelpers";
import { SourceType } from "utils/types";

interface IBrowserItemPropTypes {
  item: any;
  sourceLabel: string;
  sourceType: string;
}

const BrowserItem = ({
  item,
  sourceLabel,
  sourceType,
}: IBrowserItemPropTypes) => {
  const initiateQuerySpecification = useQuerySpecification(
    (state) => state.initiateQuerySpecification
  );
  const setContext = useQueryContext((state) => state.setContext);
  // const urlBase = sourceType === "database" ? "/browse" : "/service";

  function handleClick(event: React.MouseEvent) {
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
  }

  return (
    <div
      className="block w-full py-1 border-b cursor-pointer hover:bg-gray-200"
      onClick={handleClick}
    >
      <span className="text-sm text-gray-600 text-center ml-6 mr-3">
        <i className="fas fa-table" />
      </span>
      <span className="text-xs font-medium tracking-normal text-blue-700">
        {item.table_name}
      </span>
    </div>
  );
};

interface IPropTypes {
  sourceLabel: string;
  sourceType: SourceType;
}

function TableList({ sourceLabel, sourceType }: IPropTypes): JSX.Element {
  const schema = useSchema((store) =>
    store.rows.filter((x) => x.table_name === sourceLabel)
  );
  const isReady = useSchema((store) => store.isReady);
  const fetchSchema = useSchema((state) => state.fetchSchema);
  useEffect(() => {
    fetchSchema(sourceLabel);
  }, [sourceLabel, fetchSchema]);

  if (!schema || !isReady) {
    return <></>;
  }

  return (
    <>
      {schema
        // .filter((s) => s.properties.is_system_table === false)
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
        {schema
          // .filter((s) => s.properties.is_system_table === true)
          .map((s, i) => (
            <BrowserItem
              key={`sr-${i}`}
              item={s}
              sourceLabel={sourceLabel}
              sourceType={sourceType}
            />
          ))}
      </div>
    </>
  );
}

export default TableList;
