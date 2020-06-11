import React, { Fragment } from "react";

import { Hx } from "components/BulmaHelpers";


export default (schemaColumns, tableColumns, querySpecificationColumns) => {
  const rowList = [];
  const date_time_options = {
    year: "numeric", month: "numeric", day: "numeric",
    hour: "numeric", minute: "numeric", second: "numeric",
    hour12: false,
  };

  const DefaultCell = ({ data }) => <span>{data}</span>;
  const PrimaryKeyCell = ({ data }) => <span className="tag"><strong>ID</strong>: {data}</span>;
  const TitleCell = ({ data }) => <span><Hx x="4">{data}</Hx></span>;
  const LargeTextCell = ({ data }) => <div className="content"><p>{data}</p></div>;

  const BooleanCell = (head) => {
    return ({ data }) => (
      <span>
        {(data === true || data === false) ? (
          <Fragment>
            {data === true ? (
              <div className="tag is-light is-success">
                <strong>{head}</strong>&nbsp;
                <i className="fas fa-check-circle" />&nbsp;Yes
              </div>
            ) : (
              <div className="tag is-light is-danger">
                <strong>{head}</strong>&nbsp;
                <i className="fas fa-times-circle" />&nbsp;No
              </div>
            )}
          </Fragment>
        ) : null}
      </span>
    );
  }

  const JSONCell = () => <span>{"{}"}</span>;
  const TimeStampCell = (({ data }) => {
    try {
      return <span>{new Intl.DateTimeFormat("en-GB", date_time_options).format(new Date(data * 1000))}</span>;
    } catch (error) {
      if (error instanceof RangeError) {
        return <span>{data}</span>
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
    } else if (head.ui_hints.includes("is_title")) {
      rowList.push(TitleCell);
    } else if (head.ui_hints.includes("is_text_lg")) {
      rowList.push(LargeTextCell);
    } else if (head.ui_hints.includes("is_meta")) {
      rowList.push(DefaultCell);
    } else if (head.type === "JSONB" || head.type === "JSON") {
      rowList.push(JSONCell);
    } else if (head.type === "BOOLEAN") {
      rowList.push(BooleanCell(col));
    } else if (head.type === "TIMESTAMP") {
      rowList.push(TimeStampCell);
    } else {
      rowList.push(DefaultCell);
    }
  }

  return rowList;
}