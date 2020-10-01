import React, { useEffect, useCallback, useContext } from "react";

import { QueryContext, tableColorWhiteOnMedium } from "utils";
import {
  useSchema,
  useData,
  useQueryContext,
  useQuerySpecification,
} from "services/store";
import { getColumnSchema } from "services/querySpecification/getters";
import { Button } from "components/LayoutHelpers";
import cellRenderer from "./Cell";

export default ({ item, index }) => {
  const key = `${item.sourceLabel}/${item.tableName}/${item.pk}`;
  const queryContext = useContext(QueryContext);
  const querySpecification = useQuerySpecification(
    (state) => state[queryContext.key]
  );
  const fetchData = useData((state) => state.fetchData);
  const toggleDetailItem = useQueryContext((state) => state.toggleDetailItem);
  const schema = useSchema((state) => state[item.sourceLabel]);
  useEffect(() => {
    fetchData(key, item);
  }, [key, item, fetchData]);
  const dataItem = useData((state) => state[key]);
  const tableColors = querySpecification.tableColors;

  const handleKey = useCallback(
    (event) => {
      if (event.keyCode === 27) {
        toggleDetailItem(item);
      }
    },
    [item, toggleDetailItem]
  );
  useEffect(() => {
    document.addEventListener("keydown", handleKey, false);

    return () => {
      document.removeEventListener("keydown", handleKey, false);
    };
  }, [handleKey]);

  if (!dataItem || !dataItem.isReady) {
    return null;
  }

  const mainFields = [];
  const metaDataFields = [];

  for (const columnName in dataItem.item) {
    const colDefinition = getColumnSchema(
      schema.rows,
      `${item.tableName}.${columnName}`
    );
    const Cell = cellRenderer(colDefinition, item.sourceLabel);

    if (Cell === null) {
      continue;
    }
    if (colDefinition.ui_hints.includes("is_meta")) {
      metaDataFields.push(
        <Cell
          key={`cl-${columnName}`}
          data={dataItem.item[columnName]}
          column={colDefinition}
        />
      );
    } else {
      mainFields.push(
        <Cell
          key={`cl-${columnName}`}
          data={dataItem.item[columnName]}
          column={colDefinition}
        />
      );
    }
  }

  return (
    <div
      className="fixed bg-white border rounded shadow-md"
      style={{ top: `${4 + index * 0.4}rem`, left: `${20 + index * 2}%` }}
    >
      <div className="flex items-center bg-gray-200 p-4">
        <div className="inline-block items-center flex-grow">
          <span
            key={`grd-hd-tbl-${item.tableName}`}
            className={`inline-block text-xl font-semibold px-2 mr-2 rounded ${tableColorWhiteOnMedium(
              tableColors[item.tableName]
            )} text-white cursor-default`}
          >
            {item.tableName}
          </span>
        </div>

        <div className="inline-block items-center">
          <Button size="sm" theme="secondary">
            Update&nbsp;<i className="fas far-edit"></i>
          </Button>
          <Button
            size="sm"
            theme="secondary"
            attributes={{ onClick: () => toggleDetailItem(item) }}
          >
            Close&nbsp;<i className="fas fa-times"></i>
          </Button>
        </div>
      </div>

      <div className="flex flex-row">
        <div
          className="flex-1 p-4 min-h-full border-r-2"
          style={{ minWidth: "32rem" }}
        >
          {mainFields}
        </div>

        <div className="flex-1 p-4">{metaDataFields}</div>
      </div>
    </div>
  );
};
