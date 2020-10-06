import React, { useState, useEffect, useCallback } from "react";

import { saveDataSource } from "services/apps/actions";
import { useSchema, useQueryContext } from "services/store";
import { Button } from "components/LayoutHelpers";
import cellRenderer from "./Cell";

export default ({ item, index }) => {
  const toggleDetailItem = useQueryContext((state) => state.toggleDetailItem);
  const schema = useSchema((state) => state[item.sourceLabel]);
  const [state, setState] = useState({});

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

  const updateInputChange = (columnName, value) => {
    setState({
      [columnName]: value,
    });
  };

  const handleClickSave = () => {
    saveDataSource();
  };

  const mainFields = [];
  const metaDataFields = [];
  const schemaTable = schema.rows.find((x) => x.table_name === item.tableName);

  for (const colDefinition of schemaTable.columns) {
    const columnName = colDefinition.name;
    const Cell = cellRenderer(
      colDefinition,
      updateInputChange,
      item.sourceLabel
    );

    if (Cell === null) {
      continue;
    }
    if (colDefinition.ui_hints.includes("is_meta")) {
      metaDataFields.push(<Cell key={`cl-${columnName}`} data={null} />);
    } else {
      mainFields.push(
        <Cell key={`cl-${columnName}`} data={null} isDisabled={false} />
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
            className="inline-block text-xl font-semibold px-2 mr-2 rounded cursor-default"
          >
            {item.tableName}
          </span>
        </div>

        <div className="inline-block items-center">
          <Button size="sm" theme="success">
            Create&nbsp;<i className="far fa-check-circle"></i>
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
