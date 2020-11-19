import React, { useEffect, useCallback, useContext } from "react";

import { QueryContext, tableColorWhiteOnMedium } from "utils";
import {
  useSchema,
  useData,
  useQueryContext,
  useQuerySpecification,
} from "services/store";
import { Button } from "components/LayoutHelpers";
import cellRenderer from "./Cell";

const ViewInner = ({ item, columns }) => {
  const key = `${item.sourceLabel}/${item.tableName}/${item.pk}`;
  const fetchData = useData((state) => state.fetchData);

  useEffect(() => {
    fetchData(key, item);
  }, [key, item, fetchData]);
  const dataItem = useData((state) => state[key]);

  if (!dataItem || !dataItem.isReady) {
    return null;
  }

  const updateInputChange = () => {};
  const mainFields = [];
  const metaDataFields = [];

  for (const colDefinition of columns) {
    const columnName = colDefinition.name;
    const Cell = colDefinition.cell;

    if (Cell === null) {
      continue;
    }
    if (colDefinition.ui_hints.includes("is_meta")) {
      metaDataFields.push(
        <Cell
          key={`cl-${columnName}`}
          data={dataItem.item[columnName]}
          updateChange={updateInputChange}
        />
      );
    } else {
      mainFields.push(
        <Cell
          key={`cl-${columnName}`}
          data={dataItem.item[columnName]}
          isDisabled={false}
          updateChange={updateInputChange}
        />
      );
    }
  }

  return (
    <div className="flex flex-row">
      <div
        className="flex-1 p-4 min-h-full border-r-2"
        style={{ minWidth: "32rem" }}
      >
        {mainFields}
      </div>

      <div className="flex-1 p-4">{metaDataFields}</div>
    </div>
  );
};

export default ({ item, index }) => {
  const queryContext = useContext(QueryContext);
  const querySpecification = useQuerySpecification(
    (state) => state[queryContext.key]
  );
  const toggleDetailItem = useQueryContext((state) => state.toggleDetailItem);
  const schema = useSchema((state) => state[item.sourceLabel]);
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

  const schemaTable = schema.rows.find((x) => x.table_name === item.tableName);
  for (const colDefinition of schemaTable.columns) {
    colDefinition.cell = cellRenderer(colDefinition, item.sourceLabel);
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

      <ViewInner item={item} columns={schemaTable.columns} />
    </div>
  );
};
