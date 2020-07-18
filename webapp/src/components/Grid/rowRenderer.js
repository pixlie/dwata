import React, { Fragment } from "react";

import { getColumnSchema } from "services/querySpecification/getters";

export default (schema, tableColumns, selectedColumns) => {
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
  const classes = "px-1";

  const DefaultCell = ({ data }) => <td className={classes}>{data}</td>;
  const PrimaryKeyCell = ({ data }) => <th className={classes}>{data}</th>;
  const BooleanCell = ({ data }) => (
    <td className={classes}>
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
  const JSONCell = () => <td className={classes}>{"{}"}</td>;
  const TimeStampCell = ({ data }) => {
    try {
      return (
        <td className={classes}>
          {new Intl.DateTimeFormat("en-GB", date_time_options).format(
            new Date(data * 1000)
          )}
        </td>
      );
    } catch (error) {
      if (error instanceof RangeError) {
        return <td className={classes}>{data}</td>;
      }
    }
  };

  for (const col of tableColumns) {
    if (!selectedColumns.includes(col)) {
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
    } else {
      rowList.push(DefaultCell);
    }
  }

  return rowList;
};
