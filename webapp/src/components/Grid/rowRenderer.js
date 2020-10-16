import React, { Fragment, useContext } from "react";

import * as globalConstants from "services/global/constants";
import { QueryContext } from "utils";
import { useData, useSchema, useQuerySpecification } from "services/store";
import { getColumnSchema } from "services/querySpecification/getters";
import { useQueryContext } from "services/store";

export default () => {
  const queryContext = useContext(QueryContext);
  const gridData = useData((state) => state[queryContext.key]);
  const querySpecification = useQuerySpecification(
    (state) => state[queryContext.key]
  );
  const schema = useSchema((state) => state[querySpecification.sourceLabel]);
  const toggleDetailItem = useQueryContext((state) => state.toggleDetailItem);
  const { columns, selectedRowList } = gridData;

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
  const contentTextSizeClasses = "text-sm";
  const borderClasses = "border border-gray-300";
  const paddingClasses = "px-2 py-1";

  const createRowExpandCell = (tableColumn, colIndex) => {
    const RowExpandCell = ({ data, row }) => {
      const handleClick = () => {
        const [tableName] = tableColumn.split(".");
        toggleDetailItem({
          sourceLabel: querySpecification.sourceLabel,
          tableName: tableName,
          pk: row[colIndex],
          operation: globalConstants.OBJECT_READ,
        });
      };

      return (
        <td className={`${paddingClasses} ${borderClasses}`}>
          <span
            className="text-sm text-blue-600 cursor-pointer"
            onClick={handleClick}
          >
            <i className="far fa-window-maximize" />
          </span>
        </td>
      );
    };

    return RowExpandCell;
  };

  const createRowSelectorCell = () => {
    const RowSelectorCell = ({ data, row }) => {
      const handleRowSelect = (event) => {
        event.preventDefault();
        // toggleRowSelection(row[0]);
      };

      return (
        <td className={`${paddingClasses} ${borderClasses}`}>
          <input
            type="checkbox"
            onChange={handleRowSelect}
            checked={selectedRowList.includes(row[0])}
          />
        </td>
      );
    };

    return RowSelectorCell;
  };

  const DefaultCell = ({ data }) => (
    <td
      className={`${paddingClasses} ${borderClasses} ${contentTextSizeClasses}`}
    >
      {data}
    </td>
  );

  const PrimaryKeyCell = ({ data }) => (
    <th
      className={`${paddingClasses} ${borderClasses} ${contentTextSizeClasses} text-gray-600`}
    >
      {data}
    </th>
  );

  const BooleanCell = ({ data }) => (
    <td className={`${paddingClasses} ${borderClasses}`}>
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

  const JSONCell = () => (
    <td className={`${paddingClasses} ${borderClasses} text-gray-500`}>json</td>
  );

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
        <td
          className={`${paddingClasses} ${borderClasses} ${contentTextSizeClasses}`}
        >
          <span
            className={`inline-block max-w-sm h-12 overflow-hidden`}
            onClick={handleClick}
          >
            {data}
          </span>
        </td>
      );
    } else {
      return (
        <td
          className={`${paddingClasses} ${borderClasses} ${contentTextSizeClasses}`}
        >
          {data}
        </td>
      );
    }
  };

  if (querySpecification.isRowSelectable) {
    rowList.push([null, createRowSelectorCell()]);
  }
  for (const [i, col] of columns.entries()) {
    /* if (!selectedColumLabels.includes(col)) {
      rowList.push([i, null]);
      continue;
    } */
    const columnSchema = getColumnSchema(schema.rows, col);
    if (columnSchema.is_primary_key) {
      rowList.push([i, PrimaryKeyCell]);
      rowList.push([null, createRowExpandCell(col, i)]);
    } else if (columnSchema.has_foreign_keys) {
      rowList.push([i, DefaultCell]);
    } else if (columnSchema.ui_hints.includes("is_meta")) {
      rowList.push([i, DefaultCell]);
    } else if (columnSchema.type === "JSONB" || columnSchema.type === "JSON") {
      rowList.push([i, JSONCell]);
    } else if (columnSchema.type === "BOOLEAN") {
      rowList.push([i, BooleanCell]);
    } else if (columnSchema.type === "TIMESTAMP") {
      rowList.push([i, TimeStampCell]);
    } else if (columnSchema.type === "VARCHAR") {
      rowList.push([i, CharCell]);
    } else {
      rowList.push([i, DefaultCell]);
    }
  }

  return rowList;
};
