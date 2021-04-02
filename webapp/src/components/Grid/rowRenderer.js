import _ from "lodash";
import dayjs from "dayjs";

import * as globalConstants from "services/global/constants";
import { getColumnSchema } from "services/querySpecification/getters";

const rowRenderer = (
  queryContextKey,
  columns,
  querySpecification,
  schema,
  toggleDetailItem,
  toggleSelection,
  selectedRowList
) => {
  const rowList = [];
  /* const date_time_options = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
  }; */
  const contentTextSizeClasses = "text-sm";
  const borderClasses = "border border-gray-300";
  const paddingClasses = "px-1 py-1";

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
    const RowSelectorCell = ({ row }) => {
      const handleRowSelect = (event) => {
        event.preventDefault();
        toggleSelection(queryContextKey, row);
      };

      return (
        <td className={`${paddingClasses} ${borderClasses}`}>
          <input
            type="checkbox"
            onChange={handleRowSelect}
            checked={selectedRowList.findIndex((x) => _.isEqual(x, row)) !== -1}
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
        <>
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
        </>
      ) : (
        <i />
      )}
    </td>
  );

  const JSONCell = () => (
    <td
      className={`${paddingClasses} ${borderClasses} ${contentTextSizeClasses} text-gray-500`}
    >
      json
    </td>
  );

  const TimeStampCell = ({ data }) => {
    return (
      <td
        className={`${paddingClasses} ${borderClasses} ${contentTextSizeClasses}`}
      >
        {!!data ? dayjs(data).format("DD MMMM YYYY") : "-"}
      </td>
    );
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
    } else if (columnSchema.type === "JSONB" || columnSchema.type === "JSON") {
      rowList.push([i, JSONCell]);
    } else if (columnSchema.type === "BOOLEAN") {
      rowList.push([i, BooleanCell]);
    } else if (
      columnSchema.type === "TIMESTAMP" ||
      columnSchema.type === "DATETIME"
    ) {
      rowList.push([i, TimeStampCell]);
    } else if (columnSchema.type === "VARCHAR") {
      rowList.push([i, CharCell]);
    } else if (columnSchema.ui_hints.includes("is_meta")) {
      rowList.push([i, DefaultCell]);
    } else {
      rowList.push([i, DefaultCell]);
    }
  }

  return rowList;
};

export default rowRenderer;
