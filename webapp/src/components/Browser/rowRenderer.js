import React, { Fragment } from "react";


export default (schemaColumns, tableColumns, querySpecificationColumns) => {
  const rowList = [];
  const date_time_options = {
    year: "numeric", month: "numeric", day: "numeric",
    hour: "numeric", minute: "numeric", second: "numeric",
    hour12: false,
  };

  const DefaultCell = ({ data }) => <td>{data}</td>;
  const PrimaryKeyCell = ({ data }) => <th>{data}</th>;
  const BooleanCell = ({ data }) => <td>{(data === true || data === false) ? (
    <Fragment>
      {data === true ? (
        <div className="tag is-light is-success">
          <i className="fas fa-check-circle" />&nbsp;Yes
        </div>
       ) : (
        <div className="tag is-light is-danger">
          <i className="fas fa-times-circle" />&nbsp;No
        </div>
       )}
    </Fragment>
  ) : <i />}</td>;
  const JSONCell = ({ data }) => <td>{"{}"}</td>;
  const TimeStampCell = (({ data }) => {
    try {
      return <td>{new Intl.DateTimeFormat("en-GB", date_time_options).format(new Date(data * 1000))}</td>;
    } catch (error) {
      if (error instanceof RangeError) {
        return <td>{data}</td>
      }
    }
  });

  for (const col of tableColumns) {
    if (!querySpecificationColumns.includes(col)) {
      rowList.push(null);
      continue;
    }
    const head = schemaColumns.find(x => x.name === col);
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
}