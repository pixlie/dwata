import React, { Fragment } from "react";

import { getColumnSchema } from "services/querySpecification/getters";

export default (schema, tableColumns, selectedColumLabels) => {
  const rowList = [];
  const date_time_options = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
  };
  const contentTextSize = "text-sm";

  const DefaultCell = ({ data }) => (
    <td className={`p-1 ${contentTextSize}`}>{data}</td>
  );
  const PrimaryKeyCell = ({ data }) => (
    <th className={`p-1 ${contentTextSize} text-gray-600`}>{data}</th>
  );
  const BooleanCell = ({ data }) => (
    <td>
      {data === true || data === false ? (
        <Fragment>
          {data === true ? (
            <span className="inline-block bg-green-200 text-sm px-1 rounded">
              <span className="text-green-600 text-sm">
                <i className="fas fa-check-circle" />
              </span>
              &nbsp;Yes
            </span>
          ) : (
            <span className="inline-block bg-red-200 text-sm px-1 rounded">
              <span className="text-red-600 text-sm">
                <i className="fas fa-times-circle" />
              </span>
              &nbsp;No
            </span>
          )}
        </Fragment>
      ) : (
        <i />
      )}
    </td>
  );
  const JSONCell = () => <td>{"{}"}</td>;
  const TimeStampCell = ({ data }) => {
    try {
      return (
        <td>
          {new Intl.DateTimeFormat("en-GB", date_time_options).format(
            new Date(data * 1000)
          )}
        </td>
      );
    } catch (error) {
      if (error instanceof RangeError) {
        return <td>{data}</td>;
      }
    }
  };
  const CharCell = ({ data }) => {
    const maxLengthToShow = 40;
    const handleClick = () => {};

    if (data && data.length > maxLengthToShow) {
      return (
        <td>
          <span
            className={`inline-block max-w-sm h-12 p-1 ${contentTextSize} overflow-hidden`}
            onClick={handleClick}
          >
            {data}
          </span>
        </td>
      );
    } else {
      return <td className={`p-1 ${contentTextSize}`}>{data}</td>;
    }
  };

  for (const col of tableColumns) {
    if (!selectedColumLabels.includes(col)) {
      rowList.push(null);
      continue;
    }
    const head = getColumnSchema(schema, col);
    if (head.is_primary_key) {
      rowList.push(PrimaryKeyCell);
    } else if (head.has_foreign_keys) {
      rowList.push(DefaultCell);
    } else if (head.ui_hints.includes("is_meta")) {
      rowList.push(DefaultCell);
    } else if (head.type === "JSONB" || head.type === "JSON") {
      rowList.push(JSONCell);
    } else if (head.type === "BOOLEAN") {
      rowList.push(BooleanCell);
    } else if (head.type === "TIMESTAMP") {
      rowList.push(TimeStampCell);
    } else if (head.type === "VARCHAR") {
      rowList.push(CharCell);
    } else {
      rowList.push(DefaultCell);
    }
  }

  return rowList;
};
